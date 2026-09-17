/**
 * Nocturne Vault - ZK Circuit Controller Module
 * Manages the 4 Compact circuits: createVault, heartbeat, claimVault, revokeVault
 */

import { playClickSound, playHeartbeatSound, playSuccessChime } from './audio.js';
import { triggerConfetti } from './confetti.js';
import { trigger3DShockwave } from './lunar-scene.js';
import {
  createVaultOnChain,
  sendHeartbeatOnChain,
  claimVaultOnChain,
  revokeVaultOnChain,
} from './api.js';

export function initCircuitHandlers({ showToast, showTxResult, refreshVaultState, switchTab }) {
  // Circuit 1: createVault
  const createVaultForm = document.getElementById('create-vault-form');
  const vaultSecretInput = document.getElementById('vault-secret');
  const vaultBeneficiaryInput = document.getElementById('vault-beneficiary');
  const vaultDurationInput = document.getElementById('vault-duration');
  const btnCreateVault = document.getElementById('btn-create-vault');

  if (createVaultForm && btnCreateVault) {
    createVaultForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      playClickSound();

      const secret = vaultSecretInput?.value.trim();
      const beneficiary = vaultBeneficiaryInput?.value.trim();
      const durationHours = Number(vaultDurationInput?.value) || 72;

      if (!secret) {
        showToast('Please enter a confidential secret');
        return;
      }

      const btnText = btnCreateVault.querySelector('.btn-text');
      const btnLoader = btnCreateVault.querySelector('.btn-loader');
      if (btnText) btnText.textContent = 'Generating ZK Proof...';
      if (btnLoader) btnLoader.classList.remove('hidden');
      btnCreateVault.disabled = true;

      try {
        showToast('🔐 Step 1/3: Deriving owner commitment & proving witness...');
        await new Promise(r => setTimeout(r, 450));
        if (btnText) btnText.textContent = 'Submitting to Preprod...';
        showToast('⚡ Step 2/3: Submitting proof to Midnight Preprod consensus...');

        const data = await createVaultOnChain({ secret, beneficiary, durationHours });

        if (data.success) {
          showTxResult(data.txId, 'Midnight Preprod');
          playSuccessChime();
          showToast('🎉 Step 3/3: ZK Vault Created & Confirmed On-Chain!');
          triggerConfetti();
          trigger3DShockwave(0x00f2fe);
          await refreshVaultState();
          switchTab('tab-overview');
        } else {
          showToast('Error creating vault: ' + (data.error || 'Failed'));
        }
      } catch (err) {
        console.error(err);
        showToast('Network error submitting ZK proof');
      } finally {
        if (btnText) btnText.textContent = 'Lock Confidential Secret (ZK Prove)';
        if (btnLoader) btnLoader.classList.add('hidden');
        btnCreateVault.disabled = false;
      }
    });
  }

  // Circuit 2: heartbeat
  const btnSendHeartbeat = document.getElementById('btn-send-heartbeat');
  if (btnSendHeartbeat) {
    btnSendHeartbeat.addEventListener('click', async () => {
      playHeartbeatSound();
      const btnText = btnSendHeartbeat.querySelector('.btn-text');
      const btnLoader = btnSendHeartbeat.querySelector('.btn-loader');
      if (btnText) btnText.classList.add('hidden');
      if (btnLoader) btnLoader.classList.remove('hidden');
      btnSendHeartbeat.disabled = true;

      try {
        const data = await sendHeartbeatOnChain();

        if (data.success) {
          showTxResult(data.txId, 'Midnight Preprod');
          playSuccessChime();
          showToast(`⚡ Heartbeat #${data.heartbeats} verified! Inactivity timer reset.`);
          triggerConfetti();
          trigger3DShockwave(0x00f5a0);
          await refreshVaultState();
        } else {
          showToast('Error: ' + (data.error || 'Failed to submit heartbeat'));
        }
      } catch (err) {
        console.error(err);
        showToast('Error proving heartbeat witness');
      } finally {
        if (btnText) btnText.classList.remove('hidden');
        if (btnLoader) btnLoader.classList.add('hidden');
        btnSendHeartbeat.disabled = false;
      }
    });
  }

  // Circuit 3: claimVault
  const btnClaimVault = document.getElementById('btn-claim-vault');
  const claimResultBox = document.getElementById('claim-result-box');
  const revealedSecretText = document.getElementById('revealed-secret-text');

  if (btnClaimVault) {
    btnClaimVault.addEventListener('click', async () => {
      playClickSound();
      const btnText = btnClaimVault.querySelector('.btn-text');
      const btnLoader = btnClaimVault.querySelector('.btn-loader');
      if (btnText) btnText.classList.add('hidden');
      if (btnLoader) btnLoader.classList.remove('hidden');
      btnClaimVault.disabled = true;

      try {
        const data = await claimVaultOnChain();

        if (data.success) {
          showTxResult(data.txId, 'Midnight Preprod');
          if (revealedSecretText) {
            revealedSecretText.textContent = data.unlockedSecret || 'No secret disclosed.';
          }
          if (claimResultBox) claimResultBox.classList.remove('hidden');
          playSuccessChime();
          showToast('🔓 Compact disclose() executed! Secret Revealed.');
          triggerConfetti();
          trigger3DShockwave(0xffbe0b);
          await refreshVaultState();
        } else {
          showToast('Claim failed: ' + (data.error || 'Timelock not met'));
        }
      } catch (err) {
        console.error(err);
        showToast('Error claiming vault payload');
      } finally {
        if (btnText) btnText.classList.remove('hidden');
        if (btnLoader) btnLoader.classList.add('hidden');
        btnClaimVault.disabled = false;
      }
    });
  }

  // Circuit 4: revokeVault
  const btnRevokeVault = document.getElementById('btn-revoke-vault');
  if (btnRevokeVault) {
    btnRevokeVault.addEventListener('click', async () => {
      playClickSound();
      if (!confirm('Are you sure you want to permanently revoke and purge this vault?')) {
        return;
      }

      const btnText = btnRevokeVault.querySelector('.btn-text');
      const btnLoader = btnRevokeVault.querySelector('.btn-loader');
      if (btnText) btnText.classList.add('hidden');
      if (btnLoader) btnLoader.classList.remove('hidden');
      btnRevokeVault.disabled = true;

      try {
        const data = await revokeVaultOnChain();

        if (data.success) {
          showTxResult(data.txId, 'Midnight Preprod');
          showToast('🗑️ Vault revoked and purged from state machine');
          if (claimResultBox) claimResultBox.classList.add('hidden');
          trigger3DShockwave(0xff3366);
          await refreshVaultState();
          switchTab('tab-overview');
        } else {
          showToast('Revoke failed: ' + (data.error || 'Failed'));
        }
      } catch (err) {
        console.error(err);
        showToast('Error executing revokeVault');
      } finally {
        if (btnText) btnText.classList.remove('hidden');
        if (btnLoader) btnLoader.classList.add('hidden');
        btnRevokeVault.disabled = false;
      }
    });
  }
}
