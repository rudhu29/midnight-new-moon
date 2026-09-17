/**
 * Nocturne Vault - Centralized Protocol & Network Configuration
 * Midnight Network - Preprod Testnet Environment
 */

export const CONTRACT_CONFIG = {
  // Midnight Preprod Deployed Contract Address
  contractAddress: 'efa5b7c7dc3b7df598665d90bf2e8c73b815a042a94dfab39d8096b946cb0d71',
  deployerAddress: 'mn_addr_preprod1rjywwgs5zza2uwmsv2pr7qu3c9xgp9f95mq80fw3c35fxg8d0m4qvm7fke',
  network: 'Midnight Preprod Testnet',
  networkId: 'preprod',
  contractName: 'nocturne-vault',
  deployedAt: '2026-09-10T14:15:00.000Z',
  faucetUrl: 'https://midnight-tmnight-preprod.nethermind.dev',
  compactVersion: '0.16.0',
  circuits: ['createVault', 'heartbeat', 'claimVault', 'revokeVault'],
};

export const API_ENDPOINTS = {
  status: '/api/status',
  balance: '/api/balance',
  vault: '/api/vault',
  createVault: '/api/vault/create',
  heartbeat: '/api/vault/heartbeat',
  claimVault: '/api/vault/claim',
  revokeVault: '/api/vault/revoke',
  feedback: '/api/feedback',
};

/**
 * Format a long Bech32m or hex address with an ellipsis
 */
export function formatAddress(address, prefixLen = 14, suffixLen = 6) {
  if (!address || typeof address !== 'string') return '';
  if (address.length <= prefixLen + suffixLen + 3) return address;
  return `${address.slice(0, prefixLen)}...${address.slice(-suffixLen)}`;
}

/**
 * Format hex contract address with prefix
 */
export function formatContractAddress(address) {
  return formatAddress(address, 16, 8);
}
