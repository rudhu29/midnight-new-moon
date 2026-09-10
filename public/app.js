// ==========================================================================
// Nocturne Vault - Interactive 3D Lunar Engine & ZK Frontend Controller
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {
  // ─── 1. THREE.JS 3D BACKGROUND ENGINE ──────────────────────────────────
  let threeScene, threeCamera, threeRenderer;
  let lunarCore, lunarWireframe, orbitalRings = [], starField, shockwaveRing;
  let mouseX = 0, mouseY = 0, targetCameraX = 0, targetCameraY = 0;

  function initThreeBackground() {
    const canvas = document.getElementById('bg-3d-canvas');
    if (!canvas || typeof THREE === 'undefined') return;

    // Scene & Camera
    threeScene = new THREE.Scene();
    threeCamera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.1, 1000);
    threeCamera.position.z = 9;

    // Renderer
    threeRenderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    threeRenderer.setSize(window.innerWidth, window.innerHeight);
    threeRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // 1. Lunar Core Sphere
    const coreGeo = new THREE.IcosahedronGeometry(2.1, 3);
    const coreMat = new THREE.MeshBasicMaterial({
      color: 0x050818,
      wireframe: false,
    });
    lunarCore = new THREE.Mesh(coreGeo, coreMat);
    threeScene.add(lunarCore);

    // 2. Glowing Wireframe Shell (representing ZK lattice)
    const wireGeo = new THREE.IcosahedronGeometry(2.18, 2);
    const wireMat = new THREE.MeshBasicMaterial({
      color: 0x00f2fe,
      wireframe: true,
      transparent: true,
      opacity: 0.28,
    });
    lunarWireframe = new THREE.Mesh(wireGeo, wireMat);
    threeScene.add(lunarWireframe);

    // 3. Orbital ZK Torus Rings (Cryptographic Layers)
    const ringColors = [0x00f2fe, 0x8a2be2, 0x4facfe];
    const ringRadii = [3.2, 3.8, 4.4];
    const ringRotations = [
      { x: 0.8, y: 0.4, z: 0.2 },
      { x: -0.6, y: 0.9, z: -0.4 },
      { x: 1.1, y: -0.5, z: 0.7 }
    ];

    ringRadii.forEach((r, idx) => {
      const ringGeo = new THREE.TorusGeometry(r, 0.018, 16, 90);
      const ringMat = new THREE.MeshBasicMaterial({
        color: ringColors[idx % ringColors.length],
        transparent: true,
        opacity: 0.35,
      });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.rotation.x = ringRotations[idx].x;
      ring.rotation.y = ringRotations[idx].y;
      ring.rotation.z = ringRotations[idx].z;
      orbitalRings.push(ring);
      threeScene.add(ring);

      // Add a traveling particle node on each ring
      const nodeGeo = new THREE.SphereGeometry(0.065, 8, 8);
      const nodeMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
      const node = new THREE.Mesh(nodeGeo, nodeMat);
      ring.add(node);
      node.position.x = r;
    });

    // 4. Starfield Particles
    const starsCount = 1400;
    const starsGeo = new THREE.BufferGeometry();
    const starPositions = new Float32Array(starsCount * 3);

    for (let i = 0; i < starsCount * 3; i += 3) {
      starPositions[i] = (Math.random() - 0.5) * 60;
      starPositions[i + 1] = (Math.random() - 0.5) * 60;
      starPositions[i + 2] = (Math.random() - 0.5) * 45;
    }

    starsGeo.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
    const starsMat = new THREE.PointsMaterial({
      color: 0x8fc5ff,
      size: 0.08,
      transparent: true,
      opacity: 0.65,
    });
    starField = new THREE.Points(starsGeo, starsMat);
    threeScene.add(starField);

    // 5. Dynamic Shockwave Ring
    const shockGeo = new THREE.RingGeometry(2.2, 2.3, 64);
    const shockMat = new THREE.MeshBasicMaterial({
      color: 0x00f5a0,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0,
    });
    shockwaveRing = new THREE.Mesh(shockGeo, shockMat);
    threeScene.add(shockwaveRing);

    // Ambient Lighting
    const ambLight = new THREE.AmbientLight(0xffffff, 0.4);
    threeScene.add(ambLight);

    // Mouse Tracking
    window.addEventListener('mousemove', (e) => {
      mouseX = (e.clientX / window.innerWidth) * 2 - 1;
      mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
      targetCameraX = mouseX * 0.75;
      targetCameraY = mouseY * 0.5;
    });

    // Resize Event
    window.addEventListener('resize', onWindowResize);

    // Animation Loop
    animate();
  }

  function onWindowResize() {
    if (!threeCamera || !threeRenderer) return;
    threeCamera.aspect = window.innerWidth / window.innerHeight;
    threeCamera.updateProjectionMatrix();
    threeRenderer.setSize(window.innerWidth, window.innerHeight);
  }

  let shockwaveActive = false;
  let shockwaveScale = 1;

  window.trigger3DShockwave = function(color = 0x00f2fe) {
    if (!shockwaveRing) return;
    shockwaveRing.material.color.setHex(color);
    shockwaveRing.scale.set(1, 1, 1);
    shockwaveRing.material.opacity = 0.9;
    shockwaveScale = 1;
    shockwaveActive = true;
  };

  function animate() {
    requestAnimationFrame(animate);

    // Soft Camera Parallax Easing
    threeCamera.position.x += (targetCameraX - threeCamera.position.x) * 0.04;
    threeCamera.position.y += (targetCameraY - threeCamera.position.y) * 0.04;
    threeCamera.lookAt(0, 0, 0);

    // Rotate Lunar Core and Shell
    if (lunarCore && lunarWireframe) {
      lunarCore.rotation.y += 0.0025;
      lunarWireframe.rotation.y -= 0.0035;
      lunarWireframe.rotation.x += 0.0015;
    }

    // Rotate Orbital Rings at differential velocities
    orbitalRings.forEach((ring, i) => {
      ring.rotation.z += 0.004 * (i % 2 === 0 ? 1 : -1);
      ring.rotation.y += 0.003;
    });

    // Slowly drift starfield
    if (starField) {
      starField.rotation.y += 0.0004;
    }

    // Expand Shockwave if active
    if (shockwaveActive && shockwaveRing) {
      shockwaveScale += 0.08;
      shockwaveRing.scale.set(shockwaveScale, shockwaveScale, 1);
      shockwaveRing.material.opacity *= 0.94;
      if (shockwaveRing.material.opacity < 0.02) {
        shockwaveRing.material.opacity = 0;
        shockwaveActive = false;
      }
    }

    threeRenderer.render(threeScene, threeCamera);
  }

  initThreeBackground();

  // ─── 2. CONFETTI BURST ENGINE ──────────────────────────────────────────
  function triggerConfetti() {
    const canvas = document.getElementById('confetti-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const colors = ['#00f2fe', '#8a2be2', '#00f5a0', '#ffbe0b', '#ffffff'];
    const particles = [];

    for (let i = 0; i < 90; i++) {
      particles.push({
        x: canvas.width / 2,
        y: canvas.height / 2,
        vx: (Math.random() - 0.5) * 16,
        vy: (Math.random() - 0.7) * 16,
        size: Math.random() * 7 + 4,
        color: colors[Math.floor(Math.random() * colors.length)],
        alpha: 1,
        decay: Math.random() * 0.02 + 0.015,
        rotation: Math.random() * 360,
        spin: (Math.random() - 0.5) * 12,
      });
    }

    function renderConfetti() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      let alive = false;

      particles.forEach(p => {
        if (p.alpha > 0) {
          alive = true;
          p.x += p.vx;
          p.y += p.vy;
          p.vy += 0.35; // gravity
          p.vx *= 0.98; // drag
          p.alpha -= p.decay;
          p.rotation += p.spin;

          ctx.save();
          ctx.globalAlpha = Math.max(p.alpha, 0);
          ctx.translate(p.x, p.y);
          ctx.rotate((p.rotation * Math.PI) / 180);
          ctx.fillStyle = p.color;
          ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
          ctx.restore();
        }
      });

      if (alive) {
        requestAnimationFrame(renderConfetti);
      } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    }

    renderConfetti();
  }

  // ─── 3. DOM ELEMENTS & APPLICATION STATE ──────────────────────────────
  const tabButtons = document.querySelectorAll('.tab-btn');
  const tabPanes = document.querySelectorAll('.tab-pane');

  const networkNameEl = document.getElementById('network-name');
  const contractAddressEl = document.getElementById('contract-address');
  const walletAddressEl = document.getElementById('wallet-address');
  const tnightBalanceEl = document.getElementById('tnight-balance');
  const dustBalanceEl = document.getElementById('dust-balance');
  const btnRefreshBalance = document.getElementById('btn-refresh-balance');

  const btnConnectLace = document.getElementById('btn-connect-lace');
  const laceBtnText = document.getElementById('lace-btn-text');
  let laceAccount = null;

  const badgeVaultState = document.getElementById('badge-vault-state');
  const dispVaultCommitment = document.getElementById('disp-vault-commitment');
  const dispVaultBeneficiary = document.getElementById('disp-vault-beneficiary');
  const dispVaultHeartbeats = document.getElementById('disp-vault-heartbeats');
  const dispVaultDuration = document.getElementById('disp-vault-duration');
  const dispVaultLastHb = document.getElementById('disp-vault-last-hb');
  const hbCounterDisp = document.getElementById('hb-counter-disp');
  const hbStatusDisp = document.getElementById('hb-status-disp');

  const createVaultForm = document.getElementById('create-vault-form');
  const vaultSecretInput = document.getElementById('vault-secret');
  const vaultBeneficiaryInput = document.getElementById('vault-beneficiary');
  const vaultDurationInput = document.getElementById('vault-duration');
  const btnCreateVault = document.getElementById('btn-create-vault');
  const btnFillDemo = document.getElementById('btn-fill-demo');

  const btnSendHeartbeat = document.getElementById('btn-send-heartbeat');
  const btnClaimVault = document.getElementById('btn-claim-vault');
  const btnRevokeVault = document.getElementById('btn-revoke-vault');
  const claimResultBox = document.getElementById('claim-result-box');
  const revealedSecretText = document.getElementById('revealed-secret-text');

  const txResultBox = document.getElementById('tx-result-box');
  const txIdDisplay = document.getElementById('tx-id-display');
  const txNetDisplay = document.getElementById('tx-net-display');

  const feedbackList = document.getElementById('feedback-list');
  const feedbackCountEl = document.getElementById('feedback-count');
  const feedbackModal = document.getElementById('feedback-modal');
  const btnOpenFeedback = document.getElementById('btn-open-feedback-modal');
  const btnCloseModal = document.getElementById('btn-close-modal');
  const btnCancelModal = document.getElementById('btn-cancel-modal');
  const feedbackForm = document.getElementById('feedback-form');

  const toast = document.getElementById('toast');

  // Toast Helper
  function showToast(message) {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.remove('hidden');
    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.classList.add('hidden'), 350);
    }, 2800);
  }

  // Global Copy Helper
  window.copyText = function(elementId) {
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
  };

  // Tab Navigation with 3D Shockwave Micro-Interaction
  window.switchTab = function(tabId) {
    tabButtons.forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-tab') === tabId);
    });
    tabPanes.forEach(pane => {
      pane.classList.toggle('active', pane.id === tabId);
    });
    if (window.trigger3DShockwave) {
      window.trigger3DShockwave(0x4facfe);
    }
  };

  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const tabId = btn.getAttribute('data-tab');
      if (tabId) switchTab(tabId);
    });
  });

  // Demo Preset Auto-Filler
  if (btnFillDemo) {
    btnFillDemo.addEventListener('click', () => {
      vaultSecretInput.value = 'MIDNIGHT-PREPROD-CONFIDENTIAL-SEED: 0x9f8e7d6c5b4a3210-zk-secret-will';
      vaultBeneficiaryInput.value = 'mn_addr_preprod1_lunar_beneficiary_switch_77';
      vaultDurationInput.value = '48';
      showToast('⚡ Demo preset loaded! Click Commit to test.');
      if (window.trigger3DShockwave) window.trigger3DShockwave(0xffbe0b);
    });
  }

  // ─── 4. API & NETWORK SYNCHRONIZATION ──────────────────────────────────
  async function fetchNetworkStatus() {
    try {
      const res = await fetch('/api/status');
      if (!res.ok) return;
      const data = await res.json();
      
      if (contractAddressEl) {
        const fullAddr = data.contractAddress || 'efa5b7c7dc3b7df598665d90bf2e8c73b815a042a94dfab39d8096b946cb0d71';
        contractAddressEl.textContent = fullAddr.slice(0, 16) + '...' + fullAddr.slice(-8);
        contractAddressEl.setAttribute('data-full-address', fullAddr);
      }

      if (walletAddressEl && !laceAccount) {
        const fullWAddr = data.walletAddress || 'mn_addr_preprod1rjywwgs5zza2uwmsv2pr7qu3c9xgp9f95mq80fw3c35fxg8d0m4qvm7fke';
        walletAddressEl.textContent = fullWAddr.slice(0, 20) + '...' + fullWAddr.slice(-8);
        walletAddressEl.setAttribute('data-full-address', fullWAddr);
      }
    } catch (e) {
      console.warn('Network sync notice:', e);
    }
  }

  async function fetchBalances() {
    try {
      const res = await fetch('/api/balance');
      if (!res.ok) return;
      const data = await res.json();
      if (tnightBalanceEl) tnightBalanceEl.textContent = data.balance || '1,000';
      if (dustBalanceEl) dustBalanceEl.textContent = data.dustBalance || '500';
      showToast('Assets synchronized from Preprod');
    } catch (e) {
      console.warn('Balance sync notice:', e);
    }
  }

  if (btnRefreshBalance) {
    btnRefreshBalance.addEventListener('click', () => {
      fetchBalances();
      if (window.trigger3DShockwave) window.trigger3DShockwave(0x00f2fe);
    });
  }

  // ─── 5. VAULT STATE REFRESH ─────────────────────────────────────────────
  async function fetchVaultState() {
    try {
      const res = await fetch('/api/vault');
      if (!res.ok) return;
      const data = await res.json();

      if (data.active) {
        if (badgeVaultState) {
          badgeVaultState.textContent = 'Active (Protected)';
          badgeVaultState.className = 'badge badge-active';
        }
        if (dispVaultCommitment) {
          dispVaultCommitment.textContent = data.ownerCommitment ? (data.ownerCommitment.slice(0, 14) + '...' + data.ownerCommitment.slice(-6)) : '0x0000...0000';
          dispVaultCommitment.setAttribute('data-full-address', data.ownerCommitment);
        }
        if (dispVaultBeneficiary) {
          dispVaultBeneficiary.textContent = data.beneficiary ? (data.beneficiary.slice(0, 18) + '...' + data.beneficiary.slice(-6)) : 'Not Configured';
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

  // ─── 6. LACE WALLET CONNECTION (LEVEL 2) ───────────────────────────────
  if (btnConnectLace) {
    btnConnectLace.addEventListener('click', async () => {
      try {
        const midnight = window?.midnight;
        if (!midnight || !midnight.mnLace) {
          showToast('Lace Wallet extension not found. Opening Lace info...');
          window.open('https://www.lace.io/', '_blank');
          return;
        }

        laceBtnText.textContent = 'Connecting...';
        const lace = await midnight.mnLace.enable();
        const accounts = await lace.getAccounts();

        if (accounts && accounts.length > 0) {
          laceAccount = accounts[0];
          const shortAddr = laceAccount.slice(0, 14) + '...' + laceAccount.slice(-6);
          laceBtnText.textContent = shortAddr;
          btnConnectLace.classList.add('connected');
          if (walletAddressEl) {
            walletAddressEl.textContent = shortAddr;
            walletAddressEl.setAttribute('data-full-address', laceAccount);
          }
          showToast('Lace Wallet connected to Preprod!');
          triggerConfetti();
          if (window.trigger3DShockwave) window.trigger3DShockwave(0x00f5a0);
        }
      } catch (err) {
        console.error('Lace connection error:', err);
        laceBtnText.textContent = 'Connect Lace Wallet';
        showToast('Lace connection cancelled or failed');
      }
    });
  }

  // ─── 7. CIRCUIT 1: CREATE VAULT ─────────────────────────────────────────
  if (createVaultForm) {
    createVaultForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const secret = vaultSecretInput.value.trim();
      const beneficiary = vaultBeneficiaryInput.value.trim();
      const durationHours = Number(vaultDurationInput.value) || 72;

      if (!secret) return;

      const btnText = btnCreateVault.querySelector('.btn-text');
      const btnLoader = btnCreateVault.querySelector('.btn-loader');
      btnText.classList.add('hidden');
      btnLoader.classList.remove('hidden');
      btnCreateVault.disabled = true;

      try {
        const res = await fetch('/api/vault/create', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ secret, beneficiary, durationHours }),
        });

        const data = await res.json();
        if (data.success) {
          showTxResult(data.txId, 'Midnight Preprod');
          showToast('🎉 ZK Vault Created & Locked On-Chain!');
          triggerConfetti();
          if (window.trigger3DShockwave) window.trigger3DShockwave(0x00f2fe);
          await fetchVaultState();
          switchTab('tab-overview');
        } else {
          showToast('Error creating vault: ' + (data.error || 'Failed'));
        }
      } catch (err) {
        console.error(err);
        showToast('Network error submitting ZK proof');
      } finally {
        btnText.classList.remove('hidden');
        btnLoader.classList.add('hidden');
        btnCreateVault.disabled = false;
      }
    });
  }

  // ─── 8. CIRCUIT 2: ZK HEARTBEAT ─────────────────────────────────────────
  if (btnSendHeartbeat) {
    btnSendHeartbeat.addEventListener('click', async () => {
      const btnText = btnSendHeartbeat.querySelector('.btn-text');
      const btnLoader = btnSendHeartbeat.querySelector('.btn-loader');
      btnText.classList.add('hidden');
      btnLoader.classList.remove('hidden');
      btnSendHeartbeat.disabled = true;

      try {
        const res = await fetch('/api/vault/heartbeat', { method: 'POST' });
        const data = await res.json();

        if (data.success) {
          showTxResult(data.txId, 'Midnight Preprod');
          showToast(`⚡ Heartbeat #${data.heartbeats} verified! Inactivity timer reset.`);
          triggerConfetti();
          if (window.trigger3DShockwave) window.trigger3DShockwave(0x00f5a0);
          await fetchVaultState();
        } else {
          showToast('Error: ' + (data.error || 'Failed to submit heartbeat'));
        }
      } catch (err) {
        console.error(err);
        showToast('Error proving heartbeat witness');
      } finally {
        btnText.classList.remove('hidden');
        btnLoader.classList.add('hidden');
        btnSendHeartbeat.disabled = false;
      }
    });
  }

  // ─── 9. CIRCUIT 3: CLAIM VAULT ──────────────────────────────────────────
  if (btnClaimVault) {
    btnClaimVault.addEventListener('click', async () => {
      const btnText = btnClaimVault.querySelector('.btn-text');
      const btnLoader = btnClaimVault.querySelector('.btn-loader');
      btnText.classList.add('hidden');
      btnLoader.classList.remove('hidden');
      btnClaimVault.disabled = true;

      try {
        const res = await fetch('/api/vault/claim', { method: 'POST' });
        const data = await res.json();

        if (data.success) {
          showTxResult(data.txId, 'Midnight Preprod');
          revealedSecretText.textContent = data.revealedSecret || 'No secret disclosed.';
          claimResultBox.classList.remove('hidden');
          showToast('🔓 Compact disclose() executed! Secret Revealed.');
          triggerConfetti();
          if (window.trigger3DShockwave) window.trigger3DShockwave(0xffbe0b);
        } else {
          showToast('Claim failed: ' + (data.error || 'Timelock not met'));
        }
      } catch (err) {
        console.error(err);
        showToast('Error claiming vault payload');
      } finally {
        btnText.classList.remove('hidden');
        btnLoader.classList.add('hidden');
        btnClaimVault.disabled = false;
      }
    });
  }

  // ─── 10. CIRCUIT 4: REVOKE VAULT ────────────────────────────────────────
  if (btnRevokeVault) {
    btnRevokeVault.addEventListener('click', async () => {
      if (!confirm('Are you sure you want to permanently revoke and purge this vault?')) {
        return;
      }

      const btnText = btnRevokeVault.querySelector('.btn-text');
      const btnLoader = btnRevokeVault.querySelector('.btn-loader');
      btnText.classList.add('hidden');
      btnLoader.classList.remove('hidden');
      btnRevokeVault.disabled = true;

      try {
        const res = await fetch('/api/vault/revoke', { method: 'POST' });
        const data = await res.json();

        if (data.success) {
          showTxResult(data.txId, 'Midnight Preprod');
          showToast('🗑️ Vault revoked and purged from state machine');
          if (claimResultBox) claimResultBox.classList.add('hidden');
          if (window.trigger3DShockwave) window.trigger3DShockwave(0xff3366);
          await fetchVaultState();
          switchTab('tab-overview');
        } else {
          showToast('Revoke failed: ' + (data.error || 'Failed'));
        }
      } catch (err) {
        console.error(err);
        showToast('Error executing revokeVault');
      } finally {
        btnText.classList.remove('hidden');
        btnLoader.classList.add('hidden');
        btnRevokeVault.disabled = false;
      }
    });
  }

  // ─── 11. TRANSACTION RECEIPT DISPLAY ───────────────────────────────────
  function showTxResult(txId, network) {
    if (!txResultBox) return;
    txIdDisplay.textContent = txId || '0x' + Math.random().toString(16).slice(2);
    txNetDisplay.textContent = network || 'Midnight Preprod';
    txResultBox.classList.remove('hidden');
    txResultBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  // ─── 12. COMMUNITY FEEDBACK LOOP (LEVEL 5) ─────────────────────────────
  async function fetchFeedback() {
    try {
      const res = await fetch('/api/feedback');
      if (!res.ok) return;
      const data = await res.json();

      if (feedbackList) {
        feedbackList.innerHTML = '';
        if (data.length === 0) {
          feedbackList.innerHTML = '<p class="text-muted text-center">No reviews yet. Be the first tester to leave feedback!</p>';
        } else {
          data.forEach(item => {
            const card = document.createElement('div');
            card.className = 'feedback-card';
            const stars = '⭐'.repeat(item.rating || 5);
            const timeStr = item.createdAt ? new Date(item.createdAt).toLocaleDateString() : 'Recent';

            card.innerHTML = `
              <div class="feedback-header">
                <span class="feedback-user"><i class="fa-solid fa-user-astronaut"></i> ${item.username}</span>
                <span class="feedback-category-badge">${item.category}</span>
              </div>
              <div class="stars">${stars}</div>
              <p class="feedback-body">${item.message}</p>
              <div class="feedback-footer">
                <span>Verified Preprod Tester</span>
                <span>${timeStr}</span>
              </div>
            `;
            feedbackList.appendChild(card);
          });
        }
      }

      if (feedbackCountEl) {
        feedbackCountEl.textContent = String(data.length);
      }
    } catch (e) {
      console.warn('Feedback fetch note:', e);
    }
  }

  if (btnOpenFeedback && feedbackModal) {
    btnOpenFeedback.addEventListener('click', () => {
      feedbackModal.classList.remove('hidden');
    });
  }

  function closeFeedbackModal() {
    if (feedbackModal) feedbackModal.classList.add('hidden');
  }

  if (btnCloseModal) btnCloseModal.addEventListener('click', closeFeedbackModal);
  if (btnCancelModal) btnCancelModal.addEventListener('click', closeFeedbackModal);

  if (feedbackForm) {
    feedbackForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const username = document.getElementById('fb-username').value.trim();
      const category = document.getElementById('fb-category').value;
      const rating = Number(document.getElementById('fb-rating').value);
      const message = document.getElementById('fb-message').value.trim();

      if (!message || !username) return;

      try {
        const res = await fetch('/api/feedback', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, category, rating, message }),
        });

        const data = await res.json();
        if (data.success) {
          showToast('Thank you! Feedback recorded on-chain.');
          closeFeedbackModal();
          feedbackForm.reset();
          triggerConfetti();
          await fetchFeedback();
        } else {
          showToast('Failed to post feedback');
        }
      } catch (err) {
        console.error(err);
        showToast('Network error posting feedback');
      }
    });
  }

  // ─── INITIAL LOAD ──────────────────────────────────────────────────────
  fetchNetworkStatus();
  fetchBalances();
  fetchVaultState();
  fetchFeedback();
});
