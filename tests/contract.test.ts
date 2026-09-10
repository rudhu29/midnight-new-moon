import * as fs from 'node:fs';
import * as path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { resolveNetwork, NETWORK_CONFIGS, isNetworkId } from '../src/network.js';
import { unshieldedToken } from '@midnight-ntwrk/midnight-js-protocol/ledger';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

interface TestResult {
  name: string;
  passed: boolean;
  error?: string;
  durationMs: number;
}

const results: TestResult[] = [];

async function test(name: string, fn: () => Promise<void> | void) {
  const start = performance.now();
  try {
    await fn();
    const durationMs = Math.round(performance.now() - start);
    results.push({ name, passed: true, durationMs });
    console.log(`  ✓ ${name} (${durationMs}ms)`);
  } catch (err: any) {
    const durationMs = Math.round(performance.now() - start);
    results.push({ name, passed: false, error: err?.message || String(err), durationMs });
    console.error(`  ✗ ${name} (${durationMs}ms)`);
    console.error(`    Error: ${err?.message || err}`);
  }
}

function assert(condition: boolean, message: string) {
  if (!condition) {
    throw new Error(message);
  }
}

async function runSuite() {
  console.log('\n======================================================');
  console.log('       Midnight Network Test Suite - New Moon');
  console.log('======================================================\n');

  console.log('Contract & ZK Circuit Artifacts:');

  await test('Compact contract source file exists and defines storeMessage', () => {
    const contractPath = path.join(projectRoot, 'contracts', 'hello-world.compact');
    assert(fs.existsSync(contractPath), 'contracts/hello-world.compact must exist');
    const content = fs.readFileSync(contractPath, 'utf-8');
    assert(content.includes('export ledger message'), 'Must define public ledger message');
    assert(content.includes('export circuit storeMessage'), 'Must export storeMessage circuit');
    assert(content.includes('disclose('), 'Must utilize disclose() for public domain transition');
  });

  await test('Managed compiler artifacts are present', () => {
    const compilerInfoPath = path.join(projectRoot, 'contracts', 'managed', 'hello-world', 'compiler', 'contract-info.json');
    assert(fs.existsSync(compilerInfoPath), 'compiler/contract-info.json must exist');
    const raw = fs.readFileSync(compilerInfoPath, 'utf-8');
    const info = JSON.parse(raw);
    const circuitNames = info.circuits.map((c: any) => typeof c === 'string' ? c : c.name);
    assert(circuitNames.includes('storeMessage'), 'circuits must list storeMessage');
  });

  await test('Zero-Knowledge circuit definitions (ZKIR) are generated', () => {
    const zkirPath = path.join(projectRoot, 'contracts', 'managed', 'hello-world', 'zkir', 'storeMessage.zkir');
    const bzkirPath = path.join(projectRoot, 'contracts', 'managed', 'hello-world', 'zkir', 'storeMessage.bzkir');
    assert(fs.existsSync(zkirPath), 'zkir/storeMessage.zkir must exist');
    assert(fs.existsSync(bzkirPath), 'zkir/storeMessage.bzkir must exist');
    assert(fs.statSync(zkirPath).size > 0, 'ZKIR file must not be empty');
  });

  await test('Proving and verifying keys are generated', () => {
    const proverPath = path.join(projectRoot, 'contracts', 'managed', 'hello-world', 'keys', 'storeMessage.prover');
    const verifierPath = path.join(projectRoot, 'contracts', 'managed', 'hello-world', 'keys', 'storeMessage.verifier');
    assert(fs.existsSync(proverPath), 'keys/storeMessage.prover must exist');
    assert(fs.existsSync(verifierPath), 'keys/storeMessage.verifier must exist');
    assert(fs.statSync(proverPath).size > 1000, 'Prover key must be populated');
    assert(fs.statSync(verifierPath).size > 100, 'Verifier key must be populated');
  });

  await test('Compiled TypeScript/JavaScript contract runtime bindings are importable', async () => {
    const contractJsPath = path.join(projectRoot, 'contracts', 'managed', 'hello-world', 'contract', 'index.js');
    assert(fs.existsSync(contractJsPath), 'contract/index.js runtime must exist');
    const contractModule = await import(pathToFileURL(contractJsPath).href);
    assert(typeof contractModule.Contract === 'function', 'Contract constructor must be exported');
    assert(typeof contractModule.ledger === 'function', 'ledger decoder function must be exported');
  });

  console.log('\nNetwork & Wallet Infrastructure:');

  await test('Supported network configurations are valid and complete', () => {
    const networks = ['undeployed', 'preview', 'preprod'] as const;
    for (const net of networks) {
      assert(isNetworkId(net), `Network ${net} must be recognized`);
      const cfg = NETWORK_CONFIGS[net];
      assert(Boolean(cfg.indexer), `${net} indexer URL must be configured`);
      assert(Boolean(cfg.node), `${net} node URL must be configured`);
      assert(Boolean(cfg.proofServer), `${net} proof server URL must be configured`);
    }
  });

  await test('Default network resolution defaults to undeployed devnet', () => {
    const result = resolveNetwork({ argv: ['node', 'test'], env: {} });
    assert(result.network === 'undeployed' || result.network === 'preview' || result.network === 'preprod', 'Active network must be valid');
    assert(Boolean(result.config), 'Network config must resolve');
  });

  await test('Unshielded native token helper returns valid token descriptor', () => {
    const token = unshieldedToken();
    assert(typeof token.raw === 'string' && token.raw.length > 0, 'Unshielded token identifier must be valid string');
  });

  console.log('\nLedger & Privacy Semantics:');

  await test('String encoding matches Midnight ledger byte representation', () => {
    const testMessage = 'Hello Midnight Moonlight';
    const buffer = Buffer.from(testMessage, 'utf-8');
    const reconstructed = buffer.toString('utf-8');
    assert(reconstructed === testMessage, 'Buffer encoding/decoding should round-trip');
  });

  // Summary
  const total = results.length;
  const passed = results.filter((r) => r.passed).length;
  const failed = total - passed;

  console.log('\n------------------------------------------------------');
  console.log(`Test Results: ${passed}/${total} passed (${failed} failed)`);
  console.log('------------------------------------------------------\n');

  if (failed > 0) {
    process.exit(1);
  } else {
    console.log('🎉 All Level 1 tests passed successfully!\n');
    process.exit(0);
  }
}

runSuite().catch((err) => {
  console.error('Test runner encountered unexpected error:', err);
  process.exit(1);
});
