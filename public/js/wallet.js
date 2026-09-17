/**
 * Nocturne Vault - Midnight Lace Wallet Integration Module
 * Handles window.midnight.mnLace connection, account retrieval, and state management
 */

import { CONTRACT_CONFIG, formatAddress } from './config.js';
import { playClickSound, playSuccessChime } from './audio.js';
import { triggerConfetti } from './confetti.js';
import { trigger3DShockwave } from './lunar-scene.js';

let laceAccount = null;

export function getActiveAccount() {
  return laceAccount;
}

export function isWalletConnected() {
  return Boolean(laceAccount);
}

export function initWalletControls({ showToast }) {
  const btnConnectLace = document.getElementById('btn-connect-lace');
  const btnDisconnectLace = document.getElementById('btn-disconnect-lace');
  const laceBtnText = document.getElementById('lace-btn-text');
  const laceActiveAddressEl = document.getElementById('lace-active-address');
  const walletAddressEl = document.getElementById('wallet-address');

  function disconnect() {
    playClickSound();
    laceAccount = null;
    if (laceBtnText) laceBtnText.textContent = 'Connect Lace Wallet';
    if (btnConnectLace) btnConnectLace.classList.remove('connected');
    if (btnDisconnectLace) btnDisconnectLace.classList.add('hidden');

    if (laceActiveAddressEl) {
      laceActiveAddressEl.textContent = 'Not Connected (Click "Connect Lace Wallet")';
      laceActiveAddressEl.classList.add('text-muted');
      laceActiveAddressEl.removeAttribute('data-full-address');
    }

    if (walletAddressEl) {
      walletAddressEl.textContent = formatAddress(CONTRACT_CONFIG.deployerAddress, 20, 8);
      walletAddressEl.setAttribute('data-full-address', CONTRACT_CONFIG.deployerAddress);
    }
    showToast('Midnight Lace Wallet disconnected');
  }

  if (btnDisconnectLace) {
    btnDisconnectLace.addEventListener('click', (e) => {
      e.stopPropagation();
      disconnect();
    });
  }

  if (btnConnectLace) {
    btnConnectLace.addEventListener('click', async () => {
      playClickSound();

      if (laceAccount) {
        showToast(`Connected: ${formatAddress(laceAccount)} (${CONTRACT_CONFIG.network})`);
        return;
      }

      try {
        const midnight = window?.midnight;
        if (!midnight || !midnight.mnLace) {
          showToast('Midnight Lace Wallet extension not detected. Opening lace.io...');
          window.open('https://www.lace.io/', '_blank');
          return;
        }

        if (laceBtnText) laceBtnText.textContent = 'Authorizing...';
        const lace = await midnight.mnLace.enable();
        const accounts = await lace.getAccounts();

        if (accounts && accounts.length > 0) {
          laceAccount = accounts[0];
          const shortAddr = formatAddress(laceAccount);
          if (laceBtnText) laceBtnText.textContent = shortAddr;
          btnConnectLace.classList.add('connected');
          if (btnDisconnectLace) btnDisconnectLace.classList.remove('hidden');

          if (laceActiveAddressEl) {
            laceActiveAddressEl.textContent = shortAddr;
            laceActiveAddressEl.setAttribute('data-full-address', laceAccount);
            laceActiveAddressEl.classList.remove('text-muted');
          }

          if (walletAddressEl) {
            walletAddressEl.textContent = shortAddr;
            walletAddressEl.setAttribute('data-full-address', laceAccount);
          }

          playSuccessChime();
          showToast('Lace Wallet connected to Midnight Preprod!');
          triggerConfetti();
          trigger3DShockwave(0x00f5a0);
        } else {
          if (laceBtnText) laceBtnText.textContent = 'Connect Lace Wallet';
          showToast('No accounts found in Lace. Please select a Preprod account.');
        }
      } catch (err) {
        console.error('Lace connection error:', err);
        if (laceBtnText) laceBtnText.textContent = 'Connect Lace Wallet';
        const msg = err?.message || '';
        if (err?.code === 4001 || msg.toLowerCase().includes('reject') || msg.toLowerCase().includes('cancel') || msg.toLowerCase().includes('denied')) {
          showToast('Lace connection request was rejected by user.');
        } else {
          showToast('Lace connection notice: ' + (msg || 'Extension busy or unavailable'));
        }
      }
    });
  }
}
