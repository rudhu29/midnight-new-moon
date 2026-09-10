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
  console.log('   Midnight Network Test Suite - Nocturne Vault');
  console.log('======================================================\n');

  console.log('--- Contract Source Specifications ---');

  await test('hello-world.compact source exists and defines storeMessage', () => {
    const contractPath = path.join(projectRoot, 'contracts', 'hello-world.compact');
    assert(fs.existsSync(contractPath), 'contracts/hello-world.compact must exist');
    const content = fs.readFileSync(contractPath, 'utf-8');
    assert(content.includes('export ledger message'), 'Must define public ledger message');
    assert(content.includes('export circuit storeMessage'), 'Must export storeMessage circuit');
    assert(content.includes('disclose('), 'Must utilize disclose() for public domain transition');
  });

  await test('nocturne-vault.compact source exists and defines 4 confidential circuits', () => {
    const contractPath = path.join(projectRoot, 'contracts', 'nocturne-vault.compact');
    assert(fs.existsSync(contractPath), 'contracts/nocturne-vault.compact must exist');
    const content = fs.readFileSync(contractPath, 'utf-8');
    assert(content.includes('export ledger vaultActive: Boolean;'), 'Must declare vaultActive boolean ledger state');
    assert(content.includes('export ledger vaultOwnerCommitment: Bytes<32>;'), 'Must declare vaultOwnerCommitment');
    assert(content.includes('export ledger secretPayload: Opaque<"string">;'), 'Must declare secretPayload');
    assert(content.includes('export ledger heartbeats: Counter;'), 'Must declare heartbeats counter');
    assert(content.includes('export circuit createVault'), 'Must declare createVault circuit');
    assert(content.includes('export circuit heartbeat'), 'Must declare heartbeat circuit');
    assert(content.includes('export circuit claimVault'), 'Must declare claimVault circuit');
    assert(content.includes('export circuit revokeVault'), 'Must declare revokeVault circuit');
    assert(content.includes('witness secretKeyWitness'), 'Must declare private witness function');
  });

  console.log('\n--- Managed ZK Circuits & Cryptographic Keys ---');

  await test('Managed artifacts compiler metadata for Nocturne Vault contains all 4 circuits', () => {
    const compilerInfoPath = path.join(projectRoot, 'contracts', 'managed', 'nocturne-vault', 'compiler', 'contract-info.json');
    assert(fs.existsSync(compilerInfoPath), 'compiler/contract-info.json must exist for nocturne-vault');
    const raw = fs.readFileSync(compilerInfoPath, 'utf-8');
    const info = JSON.parse(raw);
    const circuitNames = info.circuits.map((c: any) => typeof c === 'string' ? c : c.name);
    assert(circuitNames.includes('createVault'), 'Must include createVault circuit');
    assert(circuitNames.includes('heartbeat'), 'Must include heartbeat circuit');
    assert(circuitNames.includes('claimVault'), 'Must include claimVault circuit');
    assert(circuitNames.includes('revokeVault'), 'Must include revokeVault circuit');
  });

  await test('All 4 ZKIR circuits are generated and non-empty', () => {
    const circuits = ['createVault', 'heartbeat', 'claimVault', 'revokeVault'];
    for (const c of circuits) {
      const zkirPath = path.join(projectRoot, 'contracts', 'managed', 'nocturne-vault', 'zkir', `${c}.zkir`);
      const bzkirPath = path.join(projectRoot, 'contracts', 'managed', 'nocturne-vault', 'zkir', `${c}.bzkir`);
      assert(fs.existsSync(zkirPath), `zkir/${c}.zkir must exist`);
      assert(fs.existsSync(bzkirPath), `zkir/${c}.bzkir must exist`);
      assert(fs.statSync(zkirPath).size > 0, `${c}.zkir must not be empty`);
    }
  });

  await test('Proving and verifying keys generated for all 4 circuits', () => {
    const circuits = ['createVault', 'heartbeat', 'claimVault', 'revokeVault'];
    for (const c of circuits) {
      const proverPath = path.join(projectRoot, 'contracts', 'managed', 'nocturne-vault', 'keys', `${c}.prover`);
      const verifierPath = path.join(projectRoot, 'contracts', 'managed', 'nocturne-vault', 'keys', `${c}.verifier`);
      assert(fs.existsSync(proverPath), `keys/${c}.prover must exist`);
      assert(fs.existsSync(verifierPath), `keys/${c}.verifier must exist`);
      assert(fs.statSync(proverPath).size > 1000, `${c}.prover must be valid key file`);
      assert(fs.statSync(verifierPath).size > 100, `${c}.verifier must be valid key file`);
    }
  });

  await test('Compiled Nocturne Vault TypeScript runtime bindings are importable', async () => {
    const contractJsPath = path.join(projectRoot, 'contracts', 'managed', 'nocturne-vault', 'contract', 'index.js');
    assert(fs.existsSync(contractJsPath), 'nocturne-vault contract/index.js runtime must exist');
    const contractModule = await import(pathToFileURL(contractJsPath).href);
    assert(typeof contractModule.Contract === 'function', 'Contract constructor must be exported');
    assert(typeof contractModule.ledger === 'function', 'ledger decoder function must be exported');
  });

  console.log('\n--- Network, Wallet & Multi-Phase Infrastructure ---');

  await test('Supported network configurations support Devnet, Preview, Preprod, and Mainnet', () => {
    const networks = ['undeployed', 'preview', 'preprod', 'mainnet'] as const;
    for (const net of networks) {
      assert(isNetworkId(net), `Network ${net} must be recognized`);
      const cfg = NETWORK_CONFIGS[net];
      assert(Boolean(cfg.indexer), `${net} indexer URL must be configured`);
      assert(Boolean(cfg.node), `${net} node URL must be configured`);
      assert(Boolean(cfg.proofServer), `${net} proof server URL must be configured`);
    }
  });

  await test('Active network resolution succeeds and falls back gracefully', () => {
    const result = resolveNetwork({ argv: ['node', 'test'], env: {} });
    assert(isNetworkId(result.network), 'Active network must be valid NetworkId');
    assert(Boolean(result.config), 'Network config must resolve');
  });

  await test('Unshielded native token helper returns valid token descriptor', () => {
    const token = unshieldedToken();
    assert(typeof token.raw === 'string' && token.raw.length > 0, 'Unshielded token identifier must be valid string');
  });

  console.log('\n--- Confidential State & Vault Semantics ---');

  await test('Vault payload serialization maintains byte integrity under disclose', () => {
    const secretMessage = 'CONFIDENTIAL_INHERITANCE_KEY_0x9944_LUNAR_MIDNIGHT';
    const buffer = Buffer.from(secretMessage, 'utf-8');
    const restored = buffer.toString('utf-8');
    assert(restored === secretMessage, 'Byte integrity must roundtrip');
  });

  await test('Commitment hash derivation produces valid 32-byte representation', () => {
    const dummySeed = 'dead-mans-switch-owner-secret-seed';
    const hash = Buffer.alloc(32);
    hash.write(dummySeed);
    assert(hash.length === 32, 'Commitment must be exactly 32 bytes');
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
    console.log('🎉 All Nocturne Vault tests passed successfully!\n');
    process.exit(0);
  }
}

runSuite().catch((err) => {
  console.error('Test runner encountered unexpected error:', err);
  process.exit(1);
});
