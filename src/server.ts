import express from 'express';
import cors from 'cors';
import * as path from 'node:path';
import * as fs from 'node:fs';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { WebSocket } from 'ws';
import { Buffer } from 'buffer';

import { findDeployedContract } from '@midnight-ntwrk/midnight-js-contracts';
import { httpClientProofProvider } from '@midnight-ntwrk/midnight-js-http-client-proof-provider';
import { indexerPublicDataProvider } from '@midnight-ntwrk/midnight-js-indexer-public-data-provider';
import { levelPrivateStateProvider } from '@midnight-ntwrk/midnight-js-level-private-state-provider';
import { NodeZkConfigProvider } from '@midnight-ntwrk/midnight-js-node-zk-config-provider';
import { CompiledContract } from '@midnight-ntwrk/midnight-js-protocol/compact-js';

import { resolveNetwork, getOrCreateSeed, getDeployment } from './network';
import { createWallet, persistWalletState, unshieldedToken, type WalletContext } from './wallet';

// Enable WebSocket for GraphQL subscriptions
// @ts-expect-error Required for wallet sync
globalThis.WebSocket = WebSocket;

const PRIVATE_STATE_ID = 'helloWorldPrivateState';

const { network, config: networkConfig } = resolveNetwork();
const SEED = getOrCreateSeed(network);

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const zkConfigPath = path.resolve(__dirname, '..', 'contracts', 'managed', 'hello-world');
const contractPath = path.join(zkConfigPath, 'contract', 'index.js');

if (!fs.existsSync(contractPath)) {
  console.error('\n❌ Contract not compiled! Run: npm run compile\n');
  process.exit(1);
}

const HelloWorld = await import(pathToFileURL(contractPath).href);
const compiledContract = CompiledContract.make('hello-world', HelloWorld.Contract).pipe(
  CompiledContract.withVacantWitnesses,
  CompiledContract.withCompiledFileAssets(zkConfigPath),
);

const app = express();
app.use(cors());
app.use(express.json());

// Serve frontend static files from 'public' directory
app.use(express.static(path.join(__dirname, '..', 'public')));

let walletCtx: WalletContext | null = null;
let deployedContract: any = null;
let providers: any = null;

async function createProviders(walletCtx: WalletContext) {
  const privateStatePassword = process.env.PRIVATE_STATE_PASSWORD?.trim() || 'Local-Devnet-Development-Placeholder-1';

  const walletProvider = {
    getCoinPublicKey: () => walletCtx.shieldedSecretKeys.coinPublicKey,
    getEncryptionPublicKey: () => walletCtx.shieldedSecretKeys.encryptionPublicKey,
    async balanceTx(tx: any, ttl?: Date) {
      const recipe = await walletCtx.wallet.balanceUnboundTransaction(
        tx,
        { shieldedSecretKeys: walletCtx.shieldedSecretKeys, dustSecretKey: walletCtx.dustSecretKey },
        { ttl: ttl ?? new Date(Date.now() + 30 * 60 * 1000) },
      );
      return walletCtx.wallet.finalizeRecipe(recipe);
    },
    submitTx: (tx: any) => walletCtx.wallet.submitTransaction(tx) as any,
  };

  const zkConfigProvider = new NodeZkConfigProvider(zkConfigPath);
  const accountId = walletCtx.unshieldedKeystore.getBech32Address().toString();

  return {
    privateStateProvider: levelPrivateStateProvider({
      privateStateStoreName: 'hello-world-state',
      accountId,
      privateStoragePasswordProvider: () => privateStatePassword,
    }),
    publicDataProvider: indexerPublicDataProvider(networkConfig.indexer, networkConfig.indexerWS),
    zkConfigProvider,
    proofProvider: httpClientProofProvider(networkConfig.proofServer, zkConfigProvider),
    walletProvider,
    midnightProvider: walletProvider,
  };
}

async function initMidnight() {
  console.log('Initializing Midnight Wallet...');
  walletCtx = await createWallet({ network, networkConfig, seed: SEED });
  console.log('Syncing wallet with network...');
  await walletCtx.wallet.waitForSyncedState();
  await persistWalletState(network, walletCtx);
  console.log('Wallet synced successfully!');

  const deployment = getDeployment(network);
  if (!deployment) {
    throw new Error(`No deployment file found for network: ${network}`);
  }

  console.log(`Connecting to contract at: ${deployment.address}`);
  providers = await createProviders(walletCtx);
  deployedContract = await findDeployedContract(providers, {
    compiledContract: compiledContract as any,
    contractAddress: deployment.address,
    privateStateId: PRIVATE_STATE_ID,
    initialPrivateState: {},
  });
  console.log('Connected to contract!');
}

// API Routes
app.get('/api/status', (req, res) => {
  const deployment = getDeployment(network);
  res.json({
    network,
    contractAddress: deployment?.address || null,
    walletAddress: walletCtx?.unshieldedKeystore.getBech32Address().toString() || null,
  });
});

app.get('/api/balance', async (req, res) => {
  try {
    if (!walletCtx) return res.status(500).json({ error: 'Wallet not initialized' });
    const state = await walletCtx.wallet.waitForSyncedState();
    const balance = state.unshielded.balances[unshieldedToken().raw] ?? 0n;
    const dustBalance = state.dust.balance(new Date());
    res.json({
      balance: balance.toString(),
      dustBalance: dustBalance.toString(),
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to check balance' });
  }
});

app.get('/api/message', async (req, res) => {
  try {
    const deployment = getDeployment(network);
    if (!deployment) return res.status(500).json({ error: 'No deployment address' });
    
    const contractState = await providers.publicDataProvider.queryContractState(deployment.address);
    if (contractState) {
      const ledgerState = HelloWorld.ledger(contractState.data);
      const message = Buffer.from(ledgerState.message).toString();
      res.json({ message });
    } else {
      res.json({ message: '' });
    }
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to read message' });
  }
});

app.post('/api/message', async (req, res) => {
  const { message } = req.body;
  if (typeof message !== 'string') {
    return res.status(400).json({ error: 'Message must be a string' });
  }

  try {
    if (!deployedContract) return res.status(500).json({ error: 'Contract not connected' });
    console.log(`Submitting storeMessage transaction with message: "${message}"`);
    const tx = await deployedContract.callTx.storeMessage(message);
    console.log('Transaction submitted successfully:', tx.public.txId);
    
    if (walletCtx) {
      await walletCtx.wallet.waitForSyncedState();
      await persistWalletState(network, walletCtx);
    }
    
    res.json({
      txId: tx.public.txId,
      blockHeight: tx.public.blockHeight,
    });
  } catch (err: any) {
    console.error('Transaction failed:', err);
    res.status(500).json({ error: err.message || 'Transaction failed' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, async () => {
  console.log(`Server running on http://localhost:${PORT}`);
  try {
    await initMidnight();
  } catch (err) {
    console.error('Failed to initialize Midnight:', err);
  }
});
