/**
 * ==========================================================================
 * Nocturne Vault - Main Application Entry Point (ES Module Architecture)
 * Orchestrates Three.js 3D graphics, Midnight Lace Wallet, Compact Circuits,
 * and Live Preprod Contract State.
 * ==========================================================================
 */

import { CONTRACT_CONFIG, formatAddress, formatContractAddress } from './config.js';
import { initThreeBackground } from './lunar-scene.js';
import { initWalletControls, isWalletConnected, getActiveAccount } from './wallet.js';
import { initCircuitHandlers } from './circuits.js';
import { loadFeedbackList, initFeedbackModal } from './feedback.js';
import { showToast, showTxResult, switchTab, initUIBindings } from './ui.js';
import { fetchStatus, fetchBalances, fetchVault } from './api.js';

/**
 * Synchronize network status and update on-chain contract display
 */
async function syncNetworkStatus() {
  const contractAddressEl = document.getElementById('contract-address');
  const heroContractAddrEl = document.getElementById('hero-contract-address');
  const walletAddressEl = document.getElementById('wallet-address');

  try {
    const data = await fetchStatus();
    const contractAddr = data.contractAddress || CONTRACT_CONFIG.contractAddress;
    const walletAddr = data.walletAddress || CONTRACT_CONFIG.deployerAddress;

    if (contractAddressEl) {
      contractAddressEl.textContent = formatContractAddress(contractAddr);
      contractAddressEl.setAttribute('data-full-address', contractAddr);
    }

    if (heroContractAddrEl) {
      heroContractAddrEl.textContent = formatContractAddress(contractAddr);
      heroContractAddrEl.setAttribute('data-full-address', contractAddr);
    }

    if (walletAddressEl && !isWalletConnected()) {
      walletAddressEl.textContent = formatAddress(walletAddr, 20, 8);
      walletAddressEl.setAttribute('data-full-address', walletAddr);
    }
  } catch (e) {
    console.warn('Network sync notice:', e);
    // Fallback to static config
    if (contractAddressEl) {
      contractAddressEl.textContent = formatContractAddress(CONTRACT_CONFIG.contractAddress);
      contractAddressEl.setAttribute('data-full-address', CONTRACT_CONFIG.contractAddress);
    }
    if (heroContractAddrEl) {
      heroContractAddrEl.textContent = formatContractAddress(CONTRACT_CONFIG.contractAddress);
      heroContractAddrEl.setAttribute('data-full-address', CONTRACT_CONFIG.contractAddress);
    }
  }
}

/**
 * Synchronize tNIGHT and DUST balances from Preprod
 */
async function syncBalances() {
  const tnightBalanceEl = document.getElementById('tnight-balance');
  const dustBalanceEl = document.getElementById('dust-balance');

  try {
    const data = await fetchBalances();
    if (tnightBalanceEl) tnightBalanceEl.textContent = data.balance || '1,000';
    if (dustBalanceEl) dustBalanceEl.textContent = data.dustBalance || '500';
  } catch (e) {
    console.warn('Balance sync notice:', e);
  }
}

/**
 * Synchronize Vault state from Midnight contract state
 */
async function syncVaultState() {
  const badgeVaultState = document.getElementById('badge-vault-state');
  const dispVaultCommitment = document.getElementById('disp-vault-commitment');
  const dispVaultBeneficiary = document.getElementById('disp-vault-beneficiary');
  const dispVaultHeartbeats = document.getElementById('disp-vault-heartbeats');
  const dispVaultDuration = document.getElementById('disp-vault-duration');
  const dispVaultLastHb = document.getElementById('disp-vault-last-hb');
  const hbCounterDisp = document.getElementById('hb-counter-disp');
  const hbStatusDisp = document.getElementById('hb-status-disp');

  try {
    const data = await fetchVault();

    if (data.active) {
      if (badgeVaultState) {
        badgeVaultState.textContent = 'Active (Protected)';
        badgeVaultState.className = 'badge badge-active';
      }
      if (dispVaultCommitment) {
        dispVaultCommitment.textContent = data.ownerCommitment ? formatAddress(data.ownerCommitment, 14, 6) : '0x0000...0000';
        dispVaultCommitment.setAttribute('data-full-address', data.ownerCommitment);
      }
      if (dispVaultBeneficiary) {
        dispVaultBeneficiary.textContent = data.beneficiary ? formatAddress(data.beneficiary, 18, 6) : 'Not Configured';
        dispVaultBeneficiary.setAttribute('data-full-address', data.beneficiary);
      }
      if (dispVaultHeartbeats) dispVaultHeartbeats.textContent = `${data.heartbeats || 1} Verified`;
      if (hbCounterDisp) hbCounterDisp.textContent = String(data.heartbeats || 1);
      if (hbStatusDisp) {
        hbStatusDisp.textContent = 'Active (Attested)';
        hbStatusDisp.className = 'metric-value status-active';
      }
      if (dispVaultDuration) dispVaultDuration.textContent = `${data.durationHours || 72} Hours`;
      if (dispVaultLastHb) {
        const dateStr = data.lastHeartbeat ? new Date(data.lastHeartbeat).toLocaleTimeString() : 'Just now';
        dispVaultLastHb.textContent = dateStr;
      }
    } else {
      if (badgeVaultState) {
        badgeVaultState.textContent = 'No Active Vault';
        badgeVaultState.className = 'badge badge-inactive';
      }
    }
  } catch (e) {
    console.warn('Vault fetch note:', e);
  }
}

// Wire up Refresh Balance button
const btnRefreshBalance = document.getElementById('btn-refresh-balance');
if (btnRefreshBalance) {
  btnRefreshBalance.addEventListener('click', async () => {
    await syncBalances();
    showToast('Assets synchronized from Preprod');
  });
}

// Initialize Application when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  // 1. Initialize 3D Lunar Canvas Scene
  initThreeBackground();

  // 2. Initialize UI bindings (tabs, audio, demo presets, modals)
  initUIBindings();

  // 3. Initialize Midnight Lace Wallet controls
  initWalletControls({ showToast });

  // 4. Initialize ZK Circuit Handlers
  initCircuitHandlers({
    showToast,
    showTxResult,
    refreshVaultState: syncVaultState,
    switchTab,
  });

  // 5. Initialize Community Feedback Modal & List
  initFeedbackModal({ showToast });
  loadFeedbackList();

  // 6. Perform Initial State Sync
  syncNetworkStatus();
  syncBalances();
  syncVaultState();
});
