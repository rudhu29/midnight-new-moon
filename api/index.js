import express from 'express';
import cors from 'cors';
import crypto from 'node:crypto';

const app = express();
app.use(cors());
app.use(express.json());

// In-Memory Vault State for Serverless Environment
let vaultData = {
  active: false,
  ownerCommitment: '0x0000000000000000000000000000000000000000000000000000000000000000',
  secretPayload: '',
  heartbeats: 0,
  lastHeartbeat: new Date().toISOString(),
  beneficiary: 'mn_addr_preprod1_beneficiary_vault',
  durationHours: 72,
  txId: '0x0000000000000000000000000000000000000000000000000000000000000000',
};

// Level 5 Community Feedback Storage
let communityFeedback = [
  {
    id: 'fb-sample-1',
    username: 'MidnightHacker_42',
    rating: 5,
    category: 'Privacy',
    message: 'The zero-knowledge heartbeat attestation works flawlessly on Preprod. No leaks on explorer!',
    createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
    network: 'preprod',
  },
  {
    id: 'fb-sample-2',
    username: 'CryptoGuardian',
    rating: 5,
    category: 'Feature',
    message: 'Great dead-man switch design with Compact disclose() primitive. Lace connection is seamless.',
    createdAt: new Date(Date.now() - 3600000 * 12).toISOString(),
    network: 'preprod',
  },
  {
    id: 'fb-sample-3',
    username: 'LunarVoyager',
    rating: 5,
    category: 'UX',
    message: 'Cyberpunk UI with the heartbeat pulse animation looks stunning. Ready for Mainnet launch!',
    createdAt: new Date(Date.now() - 3600000 * 4).toISOString(),
    network: 'preprod',
  }
];

// ─── API Routes ─────────────────────────────────────────────────────────────

app.get('/api/status', (req, res) => {
  res.json({
    network: 'preprod',
    contractAddress: 'efa5b7c7dc3b7df598665d90bf2e8c73b815a042a94dfab39d8096b946cb0d71',
    walletAddress: 'mn_addr_preprod1rjywwgs5zza2uwmsv2pr7qu3c9xgp9f95mq80fw3c35fxg8d0m4qvm7fke',
  });
});

app.get('/api/balance', (req, res) => {
  res.json({
    balance: '1000',
    dustBalance: '500',
  });
});

// Nocturne Vault State
app.get('/api/vault', (req, res) => {
  res.json({
    network: 'preprod',
    ...vaultData,
  });
});

// Circuit 1: createVault
app.post('/api/vault/create', (req, res) => {
  const { secret, beneficiary, durationHours } = req.body;
  if (!secret) return res.status(400).json({ error: 'Secret is required' });

  const ownerCommitment = '0x' + crypto.createHash('sha256').update(secret + Date.now()).digest('hex');
  const simulatedTxId = '0x' + crypto.randomBytes(32).toString('hex');

  vaultData = {
    active: true,
    ownerCommitment,
    secretPayload: secret,
    heartbeats: 1,
    lastHeartbeat: new Date().toISOString(),
    beneficiary: beneficiary || 'mn_addr_preprod1_beneficiary_vault',
    durationHours: Number(durationHours) || 72,
    txId: simulatedTxId,
  };

  res.json({
    success: true,
    txId: simulatedTxId,
    ownerCommitment,
    vault: vaultData,
  });
});

// Circuit 2: heartbeat
app.post('/api/vault/heartbeat', (req, res) => {
  if (!vaultData.active) {
    return res.status(400).json({ error: 'No active vault found' });
  }

  const simulatedTxId = '0x' + crypto.randomBytes(32).toString('hex');
  vaultData.heartbeats += 1;
  vaultData.lastHeartbeat = new Date().toISOString();
  vaultData.txId = simulatedTxId;

  res.json({
    success: true,
    txId: simulatedTxId,
    heartbeats: vaultData.heartbeats,
    lastHeartbeat: vaultData.lastHeartbeat,
  });
});

// Circuit 3: claimVault
app.post('/api/vault/claim', (req, res) => {
  if (!vaultData.active) {
    return res.status(400).json({ error: 'Vault is already claimed or inactive' });
  }

  const simulatedTxId = '0x' + crypto.randomBytes(32).toString('hex');
  const unlockedSecret = vaultData.secretPayload;
  vaultData.active = false;
  vaultData.txId = simulatedTxId;

  res.json({
    success: true,
    txId: simulatedTxId,
    unlockedSecret,
  });
});

// Circuit 4: revokeVault
app.post('/api/vault/revoke', (req, res) => {
  if (!vaultData.active) {
    return res.status(400).json({ error: 'No active vault to revoke' });
  }

  const simulatedTxId = '0x' + crypto.randomBytes(32).toString('hex');
  vaultData.active = false;
  vaultData.secretPayload = 'REVOKED_AND_PURGED';
  vaultData.txId = simulatedTxId;

  res.json({
    success: true,
    txId: simulatedTxId,
    message: 'Vault successfully revoked and secret purged.',
  });
});

// Message fallback
app.get('/api/message', (req, res) => {
  res.json({
    message: vaultData.active ? `Nocturne Vault Active (${vaultData.heartbeats} verified heartbeats)` : 'Ready'
  });
});

app.post('/api/message', (req, res) => {
  const { message } = req.body;
  const simulatedTxId = '0x' + crypto.randomBytes(32).toString('hex');
  res.json({
    txId: simulatedTxId,
    blockHeight: 1042,
    message: message || '',
  });
});

// Level 5: Community Feedback Endpoints
app.get('/api/feedback', (req, res) => {
  res.json(communityFeedback);
});

app.post('/api/feedback', (req, res) => {
  const { username, rating, category, message } = req.body;
  if (!message || !rating) {
    return res.status(400).json({ error: 'Rating and message are required' });
  }

  const newFeedback = {
    id: `fb-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    username: username || 'Anonymous Builder',
    rating: Number(rating) || 5,
    category: category || 'UX',
    message: String(message).slice(0, 500),
    createdAt: new Date().toISOString(),
    network: 'preprod',
  };

  communityFeedback.unshift(newFeedback);
  res.json({ success: true, feedback: newFeedback });
});

export default function handler(req, res) {
  return app(req, res);
}
