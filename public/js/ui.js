/**
 * Nocturne Vault - UI Controls, Tab Switching, Modals & Toast Module
 */

import { playClickSound, toggleAudio } from './audio.js';
import { trigger3DShockwave } from './lunar-scene.js';

export function showToast(message) {
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.textContent = message;
  toast.classList.remove('hidden');
  toast.classList.add('show');
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.classList.add('hidden'), 350);
  }, 2800);
}

export function copyText(elementId) {
  playClickSound();
  const el = document.getElementById(elementId);
  if (!el) return;
  const text = el.getAttribute('data-full-address') || el.textContent || '';
  if (text && text !== 'Fetching...' && text !== '0x0000...0000') {
    navigator.clipboard.writeText(text).then(() => {
      showToast('Copied to clipboard!');
    }).catch(() => {
      showToast('Failed to copy');
    });
  }
}

// Expose copyText globally for inline HTML onclick attributes
if (typeof window !== 'undefined') {
  window.copyText = copyText;
}

export function switchTab(tabId) {
  playClickSound();
  const tabButtons = document.querySelectorAll('.tab-btn');
  const tabPanes = document.querySelectorAll('.tab-pane');

  tabButtons.forEach(btn => {
    btn.classList.toggle('active', btn.getAttribute('data-tab') === tabId);
  });
  tabPanes.forEach(pane => {
    pane.classList.toggle('active', pane.id === tabId);
  });
  trigger3DShockwave(0x4facfe);
}

// Expose switchTab globally for inline HTML onclick attributes
if (typeof window !== 'undefined') {
  window.switchTab = switchTab;
}

export function showTxResult(txId, network) {
  const txResultBox = document.getElementById('tx-result-box');
  const txIdDisplay = document.getElementById('tx-id-display');
  const txNetDisplay = document.getElementById('tx-net-display');

  if (!txResultBox) return;
  if (txIdDisplay) txIdDisplay.textContent = txId || '0x' + Math.random().toString(16).slice(2);
  if (txNetDisplay) txNetDisplay.textContent = network || 'Midnight Preprod';
  txResultBox.classList.remove('hidden');
  txResultBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

export function initUIBindings() {
  // Tabs Navigation
  const tabButtons = document.querySelectorAll('.tab-btn');
  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const tabId = btn.getAttribute('data-tab');
      if (tabId) switchTab(tabId);
    });
  });

  // Sound Toggle
  const btnToggleSound = document.getElementById('btn-toggle-sound');
  const soundIcon = document.getElementById('sound-icon');
  if (btnToggleSound && soundIcon) {
    btnToggleSound.addEventListener('click', () => {
      const enabled = toggleAudio();
      if (enabled) {
        soundIcon.className = 'fa-solid fa-volume-high';
        showToast('Tactile audio enabled');
      } else {
        soundIcon.className = 'fa-solid fa-volume-xmark';
        showToast('Audio muted');
      }
    });
  }

  // Demo Preset Button
  const btnFillDemo = document.getElementById('btn-fill-demo');
  const vaultSecretInput = document.getElementById('vault-secret');
  const vaultBeneficiaryInput = document.getElementById('vault-beneficiary');
  const vaultDurationInput = document.getElementById('vault-duration');

  if (btnFillDemo && vaultSecretInput && vaultBeneficiaryInput && vaultDurationInput) {
    btnFillDemo.addEventListener('click', () => {
      playClickSound();
      vaultSecretInput.value = 'MIDNIGHT-PREPROD-CONFIDENTIAL-SEED: 0x9f8e7d6c5b4a3210-zk-secret-will';
      vaultBeneficiaryInput.value = 'mn_addr_preprod1_lunar_beneficiary_switch_77';
      vaultDurationInput.value = '48';
      showToast('⚡ Demo preset loaded! Click Commit to test.');
      trigger3DShockwave(0xffbe0b);
    });
  }

  // Circuit Inspector Modal
  const circuitModal = document.getElementById('circuit-modal');
  const btnOpenCircuitModal = document.getElementById('btn-open-circuit-modal');
  const btnCloseCircuitModal = document.getElementById('btn-close-circuit-modal');
  const btnDoneCircuitModal = document.getElementById('btn-done-circuit-modal');

  function openCircuitModal() {
    playClickSound();
    if (circuitModal) circuitModal.classList.remove('hidden');
    trigger3DShockwave(0x8a2be2);
  }

  function closeCircuitModal() {
    if (circuitModal) circuitModal.classList.add('hidden');
  }

  if (btnOpenCircuitModal) btnOpenCircuitModal.addEventListener('click', openCircuitModal);
  if (btnCloseCircuitModal) btnCloseCircuitModal.addEventListener('click', closeCircuitModal);
  if (btnDoneCircuitModal) btnDoneCircuitModal.addEventListener('click', closeCircuitModal);

  // Live Block Height Simulation
  let currentBlockHeight = 1048328;
  setInterval(() => {
    currentBlockHeight += Math.floor(Math.random() * 2) + 1;
    const el = document.getElementById('live-block-height');
    if (el) el.textContent = currentBlockHeight.toLocaleString();
  }, 18000);
}
