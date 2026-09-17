/**
 * Nocturne Vault - REST API Client Module
 * Communicates with the local/serverless Midnight backend
 */

import { API_ENDPOINTS } from './config.js';

export async function fetchStatus() {
  const res = await fetch(API_ENDPOINTS.status);
  if (!res.ok) throw new Error(`Status API error: ${res.status}`);
  return await res.json();
}

export async function fetchBalances() {
  const res = await fetch(API_ENDPOINTS.balance);
  if (!res.ok) throw new Error(`Balance API error: ${res.status}`);
  return await res.json();
}

export async function fetchVault() {
  const res = await fetch(API_ENDPOINTS.vault);
  if (!res.ok) throw new Error(`Vault API error: ${res.status}`);
  return await res.json();
}

export async function createVaultOnChain({ secret, beneficiary, durationHours }) {
  const res = await fetch(API_ENDPOINTS.createVault, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ secret, beneficiary, durationHours }),
  });
  return await res.json();
}

export async function sendHeartbeatOnChain() {
  const res = await fetch(API_ENDPOINTS.heartbeat, { method: 'POST' });
  return await res.json();
}

export async function claimVaultOnChain() {
  const res = await fetch(API_ENDPOINTS.claimVault, { method: 'POST' });
  return await res.json();
}

export async function revokeVaultOnChain() {
  const res = await fetch(API_ENDPOINTS.revokeVault, { method: 'POST' });
  return await res.json();
}

export async function fetchCommunityFeedback() {
  const res = await fetch(API_ENDPOINTS.feedback);
  if (!res.ok) throw new Error(`Feedback API error: ${res.status}`);
  return await res.json();
}

export async function submitCommunityFeedback({ username, category, rating, message }) {
  const res = await fetch(API_ENDPOINTS.feedback, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, category, rating, message }),
  });
  return await res.json();
}
