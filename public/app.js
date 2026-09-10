// New Moon DApp Frontend Logic
document.addEventListener('DOMContentLoaded', () => {
  const networkNameEl = document.getElementById('network-name');
  const contractAddressEl = document.getElementById('contract-address');
  const walletAddressEl = document.getElementById('wallet-address');
  const tnightBalanceEl = document.getElementById('tnight-balance');
  const dustBalanceEl = document.getElementById('dust-balance');
  const onchainMessageEl = document.getElementById('onchain-message');
  const btnRefreshBalance = document.getElementById('btn-refresh-balance');
  const btnRefreshMessage = document.getElementById('btn-refresh-message');
  const messageForm = document.getElementById('message-form');
  const newMessageInput = document.getElementById('new-message-input');
  const btnSubmitTx = document.getElementById('btn-submit-tx');
  const btnText = btnSubmitTx?.querySelector('.btn-text');
  const btnLoader = btnSubmitTx?.querySelector('.btn-loader');
  const txResultBox = document.getElementById('tx-result-box');
  const txIdDisplay = document.getElementById('tx-id-display');
  const txBlockDisplay = document.getElementById('tx-block-display');
  const toast = document.getElementById('toast');

  let activeNetwork = 'undeployed';

  function showToast(message) {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.remove('hidden');
    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.classList.add('hidden'), 300);
    }, 2500);
  }

  // Copy helper attached to window for inline onclick attributes
  window.copyText = function(elementId) {
    const el = document.getElementById(elementId);
    if (!el) return;
    const text = el.getAttribute('data-full-address') || el.textContent || '';
    if (text && text !== 'Fetching...' && text !== 'Not Deployed') {
      navigator.clipboard.writeText(text).then(() => {
        showToast('Copied to clipboard!');
      }).catch(() => {
        showToast('Failed to copy');
      });
    }
  };

  function formatNetwork(net) {
    if (!net) return 'Connecting...';
    switch (net.toLowerCase()) {
      case 'undeployed':
        return 'Midnight Devnet (Local)';
      case 'preprod':
        return 'Midnight Preprod Testnet';
      case 'preview':
        return 'Midnight Preview Testnet';
      default:
        return net.toUpperCase();
    }
  }

  function formatAddress(addr) {
    if (!addr) return 'Not Available';
    if (addr.length > 20) {
      return addr.slice(0, 10) + '...' + addr.slice(-8);
    }
    return addr;
  }

  async function fetchStatus() {
    try {
      const res = await fetch('/api/status');
      if (!res.ok) throw new Error('Status request failed');
      const data = await res.json();
      
      activeNetwork = data.network || 'undeployed';
      if (networkNameEl) {
        networkNameEl.textContent = formatNetwork(activeNetwork);
      }

      if (contractAddressEl) {
        if (data.contractAddress) {
          contractAddressEl.textContent = formatAddress(data.contractAddress);
          contractAddressEl.setAttribute('data-full-address', data.contractAddress);
          contractAddressEl.title = data.contractAddress;
        } else {
          contractAddressEl.textContent = 'Not Deployed';
        }
      }

      if (walletAddressEl) {
        if (data.walletAddress) {
          walletAddressEl.textContent = formatAddress(data.walletAddress);
          walletAddressEl.setAttribute('data-full-address', data.walletAddress);
          walletAddressEl.title = data.walletAddress;
        } else {
          walletAddressEl.textContent = 'Initializing Wallet...';
        }
      }
    } catch (err) {
      console.warn('Could not fetch status:', err);
      if (networkNameEl) networkNameEl.textContent = 'Offline / Connecting';
    }
  }

  async function fetchBalance() {
    if (btnRefreshBalance) {
      btnRefreshBalance.classList.add('spinning');
    }
    try {
      const res = await fetch('/api/balance');
      if (!res.ok) throw new Error('Balance request failed');
      const data = await res.json();

      if (tnightBalanceEl) {
        const formattedNight = Number(data.balance || 0).toLocaleString();
        tnightBalanceEl.textContent = formattedNight;
      }

      if (dustBalanceEl) {
        const formattedDust = Number(data.dustBalance || 0).toLocaleString();
        dustBalanceEl.textContent = formattedDust;
      }
    } catch (err) {
      console.warn('Could not fetch balance:', err);
    } finally {
      if (btnRefreshBalance) {
        setTimeout(() => btnRefreshBalance.classList.remove('spinning'), 500);
      }
    }
  }

  async function fetchMessage() {
    if (btnRefreshMessage) {
      btnRefreshMessage.classList.add('spinning');
    }
    try {
      const res = await fetch('/api/message');
      if (!res.ok) throw new Error('Message request failed');
      const data = await res.json();

      if (onchainMessageEl) {
        if (data.message && data.message.trim().length > 0) {
          onchainMessageEl.textContent = `"${data.message}"`;
          onchainMessageEl.classList.remove('message-placeholder');
        } else {
          onchainMessageEl.textContent = 'No message stored on-chain yet.';
          onchainMessageEl.classList.add('message-placeholder');
        }
      }
    } catch (err) {
      console.warn('Could not fetch message:', err);
      if (onchainMessageEl) {
        onchainMessageEl.textContent = 'Waiting for node / indexer sync...';
      }
    } finally {
      if (btnRefreshMessage) {
        setTimeout(() => btnRefreshMessage.classList.remove('spinning'), 500);
      }
    }
  }

  // Handle form submission
  if (messageForm) {
    messageForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const message = newMessageInput?.value?.trim();
      if (!message) return;

      // Loading state
      if (btnSubmitTx) btnSubmitTx.disabled = true;
      if (btnText) btnText.textContent = 'Submitting Proof...';
      if (btnLoader) btnLoader.classList.remove('hidden');

      try {
        const res = await fetch('/api/message', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message }),
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || 'Failed to submit transaction');
        }

        // Show result
        if (txResultBox) {
          txResultBox.classList.remove('hidden');
          if (txIdDisplay) txIdDisplay.textContent = data.txId || 'N/A';
          if (txBlockDisplay) txBlockDisplay.textContent = data.blockHeight != null ? `#${data.blockHeight}` : 'Pending Confirmation';
        }

        showToast('Transaction confirmed on ledger!');
        if (newMessageInput) newMessageInput.value = '';

        // Refresh state
        setTimeout(() => {
          fetchMessage();
          fetchBalance();
        }, 1500);

      } catch (err) {
        console.error('Submit transaction error:', err);
        showToast(err.message || 'Transaction submission failed');
      } finally {
        if (btnSubmitTx) btnSubmitTx.disabled = false;
        if (btnText) btnText.textContent = 'Update Ledger';
        if (btnLoader) btnLoader.classList.add('hidden');
      }
    });
  }

  if (btnRefreshBalance) {
    btnRefreshBalance.addEventListener('click', fetchBalance);
  }

  if (btnRefreshMessage) {
    btnRefreshMessage.addEventListener('click', fetchMessage);
  }

  // Initial load
  fetchStatus();
  fetchBalance();
  fetchMessage();

  // Periodic polling for status and message
  setInterval(fetchStatus, 30000);
  setInterval(fetchBalance, 15000);
  setInterval(fetchMessage, 15000);
});
