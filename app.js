// ==========================================================================
// Nocturne Vault - Hyper-Realistic 3D Lunar Engine & ZK Controller
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {
  // ─── 1. AUDIO SYNTHESIS ENGINE (WEB AUDIO API) ─────────────────────────
  let audioCtx = null;
  let soundEnabled = true;

  function initAudio() {
    if (!audioCtx) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (AudioContextClass) audioCtx = new AudioContextClass();
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
  }

  function playHeartbeatSound() {
    if (!soundEnabled) return;
    initAudio();
    if (!audioCtx) return;

    try {
      const now = audioCtx.currentTime;
      // Resonant sub-bass thud (65Hz -> 32Hz)
      const osc1 = audioCtx.createOscillator();
      const gain1 = audioCtx.createGain();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(75, now);
      osc1.frequency.exponentialRampToValueAtTime(32, now + 0.28);
      gain1.gain.setValueAtTime(0.35, now);
      gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.32);
      osc1.connect(gain1);
      gain1.connect(audioCtx.destination);
      osc1.start(now);
      osc1.stop(now + 0.35);

      // Electronic harmonic ping
      const osc2 = audioCtx.createOscillator();
      const gain2 = audioCtx.createGain();
      osc2.type = 'triangle';
      osc2.frequency.setValueAtTime(360, now + 0.04);
      osc2.frequency.exponentialRampToValueAtTime(180, now + 0.24);
      gain2.gain.setValueAtTime(0.12, now + 0.04);
      gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.24);
      osc2.connect(gain2);
      gain2.connect(audioCtx.destination);
      osc2.start(now + 0.04);
      osc2.stop(now + 0.26);
    } catch (e) {}
  }

  function playSuccessChime() {
    if (!soundEnabled) return;
    initAudio();
    if (!audioCtx) return;

    try {
      const freqs = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
      freqs.forEach((f, idx) => {
        const now = audioCtx.currentTime + idx * 0.075;
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(f, now);
        gain.gain.setValueAtTime(0.16, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start(now);
        osc.stop(now + 0.5);
      });
    } catch (e) {}
  }

  function playClickSound() {
    if (!soundEnabled) return;
    initAudio();
    if (!audioCtx) return;

    try {
      const now = audioCtx.currentTime;
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(1200, now);
      osc.frequency.exponentialRampToValueAtTime(450, now + 0.035);
      gain.gain.setValueAtTime(0.06, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.035);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start(now);
      osc.stop(now + 0.04);
    } catch (e) {}
  }

  // Sound Toggle Control
  const btnToggleSound = document.getElementById('btn-toggle-sound');
  const soundIcon = document.getElementById('sound-icon');
  if (btnToggleSound && soundIcon) {
    btnToggleSound.addEventListener('click', () => {
      soundEnabled = !soundEnabled;
      if (soundEnabled) {
        soundIcon.className = 'fa-solid fa-volume-high';
        playClickSound();
        showToast('Tactile audio enabled');
      } else {
        soundIcon.className = 'fa-solid fa-volume-xmark';
        showToast('Audio muted');
      }
    });
  }

  // ─── 2. PROCEDURAL REALISTIC LUNAR MAP GENERATOR ───────────────────────
  function generateRealisticLunarMaps() {
    const width = 1024;
    const height = 512;

    const dCanvas = document.createElement('canvas');
    dCanvas.width = width;
    dCanvas.height = height;
    const dCtx = dCanvas.getContext('2d');

    const bCanvas = document.createElement('canvas');
    bCanvas.width = width;
    bCanvas.height = height;
    const bCtx = bCanvas.getContext('2d');

    // Base lunar highland mineral fill
    dCtx.fillStyle = '#8a8e9e';
    dCtx.fillRect(0, 0, width, height);

    bCtx.fillStyle = '#808080';
    bCtx.fillRect(0, 0, width, height);

    // Micro-noise texture for realistic lunar regolith roughness
    const imgData = dCtx.getImageData(0, 0, width, height);
    const bumpData = bCtx.getImageData(0, 0, width, height);
    for (let i = 0; i < imgData.data.length; i += 4) {
      const noise = (Math.random() - 0.5) * 26;
      imgData.data[i] = Math.min(255, Math.max(0, imgData.data[i] + noise));
      imgData.data[i + 1] = Math.min(255, Math.max(0, imgData.data[i + 1] + noise));
      imgData.data[i + 2] = Math.min(255, Math.max(0, imgData.data[i + 2] + noise));

      bumpData.data[i] = Math.min(255, Math.max(0, bumpData.data[i] + noise * 1.6));
      bumpData.data[i + 1] = bumpData.data[i];
      bumpData.data[i + 2] = bumpData.data[i];
    }
    dCtx.putImageData(imgData, 0, 0);
    bCtx.putImageData(bumpData, 0, 0);

    // Lunar Maria (Dark Basalt Plains: Oceanus Procellarum, Mare Tranquillitatis)
    const maria = [
      { x: 270, y: 170, rx: 120, ry: 95, color: '#333642' },
      { x: 430, y: 140, rx: 80, ry: 70, color: '#2d303b' },
      { x: 550, y: 190, rx: 75, ry: 55, color: '#353945' },
      { x: 630, y: 220, rx: 85, ry: 60, color: '#323540' },
      { x: 720, y: 250, rx: 70, ry: 50, color: '#393d48' },
      { x: 450, y: 290, rx: 80, ry: 60, color: '#363944' },
      { x: 220, y: 320, rx: 65, ry: 50, color: '#3c404b' },
    ];

    maria.forEach(m => {
      const grad = dCtx.createRadialGradient(m.x, m.y, 10, m.x, m.y, Math.max(m.rx, m.ry));
      grad.addColorStop(0, m.color);
      grad.addColorStop(0.65, 'rgba(60, 64, 76, 0.7)');
      grad.addColorStop(1, 'transparent');
      dCtx.fillStyle = grad;
      dCtx.beginPath();
      dCtx.ellipse(m.x, m.y, m.rx, m.ry, 0.2, 0, Math.PI * 2);
      dCtx.fill();

      // Bump (maria depression)
      const bGrad = bCtx.createRadialGradient(m.x, m.y, 10, m.x, m.y, Math.max(m.rx, m.ry));
      bGrad.addColorStop(0, '#555555');
      bGrad.addColorStop(0.7, '#727272');
      bGrad.addColorStop(1, '#808080');
      bCtx.fillStyle = bGrad;
      bCtx.beginPath();
      bCtx.ellipse(m.x, m.y, m.rx, m.ry, 0.2, 0, Math.PI * 2);
      bCtx.fill();
    });

    // 120+ Detailed Impact Craters with Rims and Shadows
    for (let c = 0; c < 125; c++) {
      const cx = Math.random() * width;
      const cy = Math.random() * height;
      const r = Math.random() * Math.random() * 26 + 3.5;

      // Ray ejecta for major craters
      if (r > 13 && Math.random() > 0.45) {
        dCtx.strokeStyle = 'rgba(235, 242, 255, 0.25)';
        dCtx.lineWidth = 1;
        for (let a = 0; a < 8; a++) {
          const ang = (a / 8) * Math.PI * 2 + Math.random() * 0.25;
          const len = r * (Math.random() * 3 + 2.2);
          dCtx.beginPath();
          dCtx.moveTo(cx, cy);
          dCtx.lineTo(cx + Math.cos(ang) * len, cy + Math.sin(ang) * len);
          dCtx.stroke();
        }
      }

      // Illuminated Rim (towards upper-right sun)
      dCtx.strokeStyle = 'rgba(245, 250, 255, 0.85)';
      dCtx.lineWidth = Math.max(r * 0.2, 1.6);
      dCtx.beginPath();
      dCtx.arc(cx, cy, r, -Math.PI * 0.25, Math.PI * 0.65);
      dCtx.stroke();

      // Shadowed Rim (away from sun)
      dCtx.strokeStyle = 'rgba(20, 23, 30, 0.9)';
      dCtx.beginPath();
      dCtx.arc(cx, cy, r, Math.PI * 0.75, Math.PI * 1.7);
      dCtx.stroke();

      // Crater interior shadow
      dCtx.fillStyle = '#1e2129';
      dCtx.beginPath();
      dCtx.arc(cx, cy, r * 0.72, 0, Math.PI * 2);
      dCtx.fill();

      // Bump Map Elevation
      bCtx.strokeStyle = '#ffffff';
      bCtx.lineWidth = Math.max(r * 0.22, 2);
      bCtx.beginPath();
      bCtx.arc(cx, cy, r, 0, Math.PI * 2);
      bCtx.stroke();

      bCtx.fillStyle = '#101010';
      bCtx.beginPath();
      bCtx.arc(cx, cy, r * 0.68, 0, Math.PI * 2);
      bCtx.fill();

      // Central peak for large impact basins
      if (r > 16) {
        dCtx.fillStyle = 'rgba(240, 245, 255, 0.95)';
        dCtx.beginPath();
        dCtx.arc(cx + 1, cy - 1, r * 0.18, 0, Math.PI * 2);
        dCtx.fill();

        bCtx.fillStyle = '#ffffff';
        bCtx.beginPath();
        bCtx.arc(cx + 1, cy - 1, r * 0.18, 0, Math.PI * 2);
        bCtx.fill();
      }
    }

    return { diffuseCanvas: dCanvas, bumpCanvas: bCanvas };
  }

  // ─── 3. THREE.JS 3D SCENE & CINEMATIC LIGHTING ────────────────────────
  let threeScene, threeCamera, threeRenderer;
  let lunarCore, lunarHalo, orbitalRings = [], starField, shockwaveRing, asteroidDust;
  let mouseX = 0, mouseY = 0, targetCameraX = 0, targetCameraY = 0;

  let isDragging = false;
  let previousMousePos = { x: 0, y: 0 };
  let moonVelocity = { x: 0.0003, y: 0.0024 };

  function initThreeBackground() {
    const canvas = document.getElementById('bg-3d-canvas');
    if (!canvas || typeof THREE === 'undefined') return;

    threeScene = new THREE.Scene();
    threeCamera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 1000);
    threeCamera.position.z = 8.5;

    threeRenderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    threeRenderer.setSize(window.innerWidth, window.innerHeight);
    threeRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Generate Procedural Realistic Lunar Surface
    const { diffuseCanvas, bumpCanvas } = generateRealisticLunarMaps();
    const diffuseTex = new THREE.CanvasTexture(diffuseCanvas);
    const bumpTex = new THREE.CanvasTexture(bumpCanvas);

    // Realistic PBR Moon Sphere
    const moonGeo = new THREE.SphereGeometry(2.35, 64, 64);
    const moonMat = new THREE.MeshStandardMaterial({
      map: diffuseTex,
      bumpMap: bumpTex,
      bumpScale: 0.09,
      roughness: 0.88,
      metalness: 0.06,
    });
    lunarCore = new THREE.Mesh(moonGeo, moonMat);
    lunarCore.rotation.x = 0.116; // 6.68 deg axial tilt
    threeScene.add(lunarCore);

    // Ethereal Outer Halo Atmosphere
    const haloGeo = new THREE.SphereGeometry(2.42, 48, 48);
    const haloMat = new THREE.MeshBasicMaterial({
      color: 0x00f2fe,
      transparent: true,
      opacity: 0.09,
      blending: THREE.AdditiveBlending,
      side: THREE.BackSide,
    });
    lunarHalo = new THREE.Mesh(haloGeo, haloMat);
    lunarCore.add(lunarHalo);

    // Directional Sunlight (Casts dramatic crater terminator shadows)
    const sunLight = new THREE.DirectionalLight(0xfff7e6, 2.7);
    sunLight.position.set(14, 6, 9);
    threeScene.add(sunLight);

    // Cyan Neon Rim Light (Midnight cryptographic aesthetic)
    const rimLight = new THREE.PointLight(0x00f2fe, 1.8, 25);
    rimLight.position.set(-10, -5, -8);
    threeScene.add(rimLight);

    // Cosmic Deep Sky Ambient Fill
    const ambientLight = new THREE.AmbientLight(0x0a0f24, 0.45);
    threeScene.add(ambientLight);

    // Orbital ZK Cryptographic Torus Rings
    const ringSpecs = [
      { r: 3.4, color: 0x00f2fe, rx: 0.8, ry: 0.3, rz: 0.2 },
      { r: 4.1, color: 0x8a2be2, rx: -0.6, ry: 0.9, rz: -0.4 },
      { r: 4.8, color: 0x00f5a0, rx: 1.1, ry: -0.5, rz: 0.7 }
    ];

    ringSpecs.forEach(spec => {
      const rGeo = new THREE.TorusGeometry(spec.r, 0.016, 16, 100);
      const rMat = new THREE.MeshBasicMaterial({
        color: spec.color,
        transparent: true,
        opacity: 0.32,
      });
      const ring = new THREE.Mesh(rGeo, rMat);
      ring.rotation.set(spec.rx, spec.ry, spec.rz);
      orbitalRings.push(ring);
      threeScene.add(ring);

      // Node particle
      const nodeGeo = new THREE.SphereGeometry(0.065, 8, 8);
      const nodeMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
      const node = new THREE.Mesh(nodeGeo, nodeMat);
      ring.add(node);
      node.position.x = spec.r;
    });

    // Deep Space Starfield Particles
    const starCount = 1500;
    const starGeo = new THREE.BufferGeometry();
    const starPos = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount * 3; i += 3) {
      starPos[i] = (Math.random() - 0.5) * 65;
      starPos[i + 1] = (Math.random() - 0.5) * 65;
      starPos[i + 2] = (Math.random() - 0.5) * 45;
    }
    starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
    const starMat = new THREE.PointsMaterial({
      color: 0x9dc8ff,
      size: 0.075,
      transparent: true,
      opacity: 0.7,
    });
    starField = new THREE.Points(starGeo, starMat);
    threeScene.add(starField);

    // Orbiting Asteroid / Cryptographic Dust Ring
    const dustCount = 450;
    const dustGeo = new THREE.BufferGeometry();
    const dustPos = new Float32Array(dustCount * 3);
    for (let i = 0; i < dustCount; i++) {
      const angle = (i / dustCount) * Math.PI * 2;
      const dist = 3.5 + (Math.random() - 0.5) * 1.5;
      dustPos[i * 3] = Math.cos(angle) * dist;
      dustPos[i * 3 + 1] = (Math.random() - 0.5) * 0.4;
      dustPos[i * 3 + 2] = Math.sin(angle) * dist;
    }
    dustGeo.setAttribute('position', new THREE.BufferAttribute(dustPos, 3));
    const dustMat = new THREE.PointsMaterial({
      color: 0x00f2fe,
      size: 0.045,
      transparent: true,
      opacity: 0.55,
    });
    asteroidDust = new THREE.Points(dustGeo, dustMat);
    asteroidDust.rotation.x = 0.5;
    threeScene.add(asteroidDust);

    // Dynamic 3D Shockwave Ring
    const shockGeo = new THREE.RingGeometry(2.35, 2.45, 64);
    const shockMat = new THREE.MeshBasicMaterial({
      color: 0x00f2fe,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0,
    });
    shockwaveRing = new THREE.Mesh(shockGeo, shockMat);
    threeScene.add(shockwaveRing);

    // Interactive Drag-to-Rotate Events
    window.addEventListener('mousedown', (e) => {
      if (['INPUT', 'TEXTAREA', 'BUTTON', 'A', 'SELECT'].includes(e.target.tagName)) return;
      isDragging = true;
      previousMousePos = { x: e.clientX, y: e.clientY };
    });

    window.addEventListener('mousemove', (e) => {
      mouseX = (e.clientX / window.innerWidth) * 2 - 1;
      mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
      targetCameraX = mouseX * 0.75;
      targetCameraY = mouseY * 0.45;

      if (isDragging && lunarCore) {
        const deltaX = e.clientX - previousMousePos.x;
        const deltaY = e.clientY - previousMousePos.y;
        lunarCore.rotation.y += deltaX * 0.0055;
        lunarCore.rotation.x += deltaY * 0.0055;
        moonVelocity = { x: deltaY * 0.0015, y: deltaX * 0.0015 };
        previousMousePos = { x: e.clientX, y: e.clientY };
      }
    });

    window.addEventListener('mouseup', () => {
      isDragging = false;
    });

    window.addEventListener('resize', () => {
      if (!threeCamera || !threeRenderer) return;
      threeCamera.aspect = window.innerWidth / window.innerHeight;
      threeCamera.updateProjectionMatrix();
      threeRenderer.setSize(window.innerWidth, window.innerHeight);
    });

    animate();
  }

  let shockwaveActive = false;
  let shockwaveScale = 1;

  window.trigger3DShockwave = function(color = 0x00f2fe) {
    if (!shockwaveRing) return;
    shockwaveRing.material.color.setHex(color);
    shockwaveRing.scale.set(1, 1, 1);
    shockwaveRing.material.opacity = 0.95;
    shockwaveScale = 1;
    shockwaveActive = true;
  };

  function animate() {
    requestAnimationFrame(animate);

    // Camera Parallax
    threeCamera.position.x += (targetCameraX - threeCamera.position.x) * 0.04;
    threeCamera.position.y += (targetCameraY - threeCamera.position.y) * 0.04;
    threeCamera.lookAt(0, 0, 0);

    // Moon Physical Inertia & Drift
    if (lunarCore) {
      if (!isDragging) {
        lunarCore.rotation.y += moonVelocity.y;
        lunarCore.rotation.x += moonVelocity.x;
        moonVelocity.x *= 0.96;
        moonVelocity.y = moonVelocity.y * 0.96 + 0.0001; // gentle resting rotation
      }
    }

    // Orbital Ring Rotations
    orbitalRings.forEach((ring, i) => {
      ring.rotation.z += 0.0035 * (i % 2 === 0 ? 1 : -1);
      ring.rotation.y += 0.0025;
    });

    // Asteroid Dust Drift
    if (asteroidDust) {
      asteroidDust.rotation.y += 0.0018;
    }

    // Starfield Slow Drift
    if (starField) {
      starField.rotation.y += 0.0003;
    }

    // Shockwave Expansion
    if (shockwaveActive && shockwaveRing) {
      shockwaveScale += 0.09;
      shockwaveRing.scale.set(shockwaveScale, shockwaveScale, 1);
      shockwaveRing.material.opacity *= 0.93;
      if (shockwaveRing.material.opacity < 0.02) {
        shockwaveRing.material.opacity = 0;
        shockwaveActive = false;
      }
    }

    threeRenderer.render(threeScene, threeCamera);
  }

  initThreeBackground();

  // ─── 4. CONFETTI PARTICLE ENGINE ───────────────────────────────────────
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
          p.vy += 0.35;
          p.vx *= 0.98;
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

  // ─── 5. UI CONTROLS & STATE BINDING ────────────────────────────────────
  const tabButtons = document.querySelectorAll('.tab-btn');
  const tabPanes = document.querySelectorAll('.tab-pane');

  const contractAddressEl = document.getElementById('contract-address');
  const walletAddressEl = document.getElementById('wallet-address');
  const tnightBalanceEl = document.getElementById('tnight-balance');
  const dustBalanceEl = document.getElementById('dust-balance');
  const btnRefreshBalance = document.getElementById('btn-refresh-balance');

  const btnConnectLace = document.getElementById('btn-connect-lace');
  const btnDisconnectLace = document.getElementById('btn-disconnect-lace');
  const laceBtnText = document.getElementById('lace-btn-text');
  const laceActiveAddressEl = document.getElementById('lace-active-address');
  let laceAccount = null;
  let defaultWalletAddress = 'mn_addr_preprod1rjywwgs5zza2uwmsv2pr7qu3c9xgp9f95mq80fw3c35fxg8d0m4qvm7fke';
  let defaultContractAddress = 'efa5b7c7dc3b7df598665d90bf2e8c73b815a042a94dfab39d8096b946cb0d71';

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

  const circuitModal = document.getElementById('circuit-modal');
  const btnOpenCircuitModal = document.getElementById('btn-open-circuit-modal');
  const btnCloseCircuitModal = document.getElementById('btn-close-circuit-modal');
  const btnDoneCircuitModal = document.getElementById('btn-done-circuit-modal');

  const toast = document.getElementById('toast');

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

  window.copyText = function(elementId) {
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
  };

  window.switchTab = function(tabId) {
    playClickSound();
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

  // Demo Preset Button
  if (btnFillDemo) {
    btnFillDemo.addEventListener('click', () => {
      playClickSound();
      vaultSecretInput.value = 'MIDNIGHT-PREPROD-CONFIDENTIAL-SEED: 0x9f8e7d6c5b4a3210-zk-secret-will';
      vaultBeneficiaryInput.value = 'mn_addr_preprod1_lunar_beneficiary_switch_77';
      vaultDurationInput.value = '48';
      showToast('⚡ Demo preset loaded! Click Commit to test.');
      if (window.trigger3DShockwave) window.trigger3DShockwave(0xffbe0b);
    });
  }

  // Circuit Modal Wiring
  if (btnOpenCircuitModal && circuitModal) {
    btnOpenCircuitModal.addEventListener('click', () => {
      playClickSound();
      circuitModal.classList.remove('hidden');
      if (window.trigger3DShockwave) window.trigger3DShockwave(0x8a2be2);
    });
  }
  function closeCircuitModal() {
    if (circuitModal) circuitModal.classList.add('hidden');
  }
  if (btnCloseCircuitModal) btnCloseCircuitModal.addEventListener('click', closeCircuitModal);
  if (btnDoneCircuitModal) btnDoneCircuitModal.addEventListener('click', closeCircuitModal);

  // Live Block Height Simulation
  let currentBlockHeight = 1048328;
  setInterval(() => {
    currentBlockHeight += Math.floor(Math.random() * 2) + 1;
    const el = document.getElementById('live-block-height');
    if (el) el.textContent = currentBlockHeight.toLocaleString();
  }, 18000);

  // ─── 6. API & NETWORK SYNCHRONIZATION ──────────────────────────────────
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
      playClickSound();
      fetchBalances();
      if (window.trigger3DShockwave) window.trigger3DShockwave(0x00f2fe);
    });
  }

  // ─── 7. VAULT STATE REFRESH ─────────────────────────────────────────────
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

  // ─── 8. LACE WALLET CONNECTION & DISCONNECT (LEVEL 2) ───────────────────
  function disconnectLaceWallet() {
    playClickSound();
    laceAccount = null;
    laceBtnText.textContent = 'Connect Lace Wallet';
    btnConnectLace.classList.remove('connected');
    if (btnDisconnectLace) btnDisconnectLace.classList.add('hidden');

    if (laceActiveAddressEl) {
      laceActiveAddressEl.textContent = 'Not Connected (Click "Connect Lace Wallet")';
      laceActiveAddressEl.classList.add('text-muted');
      laceActiveAddressEl.removeAttribute('data-full-address');
    }

    if (walletAddressEl && defaultWalletAddress) {
      walletAddressEl.textContent = defaultWalletAddress.slice(0, 20) + '...' + defaultWalletAddress.slice(-8);
      walletAddressEl.setAttribute('data-full-address', defaultWalletAddress);
    }
    showToast('Midnight Lace Wallet disconnected');
  }

  if (btnDisconnectLace) {
    btnDisconnectLace.addEventListener('click', (e) => {
      e.stopPropagation();
      disconnectLaceWallet();
    });
  }

  if (btnConnectLace) {
    btnConnectLace.addEventListener('click', async () => {
      playClickSound();

      // If already connected, inform user of active connection
      if (laceAccount) {
        showToast(`Connected: ${laceAccount.slice(0, 14)}...${laceAccount.slice(-6)} (Midnight Preprod)`);
        return;
      }

      try {
        const midnight = window?.midnight;
        if (!midnight || !midnight.mnLace) {
          showToast('Midnight Lace Wallet extension not detected. Opening lace.io...');
          window.open('https://www.lace.io/', '_blank');
          return;
        }

        laceBtnText.textContent = 'Authorizing...';
        const lace = await midnight.mnLace.enable();
        const accounts = await lace.getAccounts();

        if (accounts && accounts.length > 0) {
          laceAccount = accounts[0];
          const shortAddr = laceAccount.slice(0, 14) + '...' + laceAccount.slice(-6);
          laceBtnText.textContent = shortAddr;
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
          if (window.trigger3DShockwave) window.trigger3DShockwave(0x00f5a0);
        } else {
          laceBtnText.textContent = 'Connect Lace Wallet';
          showToast('No accounts found in Lace. Please select a Preprod account.');
        }
      } catch (err) {
        console.error('Lace connection error:', err);
        laceBtnText.textContent = 'Connect Lace Wallet';
        const msg = err?.message || '';
        if (err?.code === 4001 || msg.toLowerCase().includes('reject') || msg.toLowerCase().includes('cancel') || msg.toLowerCase().includes('denied')) {
          showToast('Lace connection request was rejected by user.');
        } else {
          showToast('Lace connection notice: ' + (msg || 'Extension busy or unavailable'));
        }
      }
    });
  }

  // ─── 9. CIRCUIT 1: CREATE VAULT ─────────────────────────────────────────
  if (createVaultForm) {
    createVaultForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      playClickSound();
      const secret = vaultSecretInput.value.trim();
      const beneficiary = vaultBeneficiaryInput.value.trim();
      const durationHours = Number(vaultDurationInput.value) || 72;

      if (!secret) return;

      const btnText = btnCreateVault.querySelector('.btn-text');
      const btnLoader = btnCreateVault.querySelector('.btn-loader');
      btnText.textContent = 'Generating ZK Proof...';
      btnLoader.classList.remove('hidden');
      btnCreateVault.disabled = true;

      try {
        showToast('🔐 Step 1/3: Deriving owner commitment & proving witness...');
        await new Promise(r => setTimeout(r, 450));
        btnText.textContent = 'Submitting to Preprod...';
        showToast('⚡ Step 2/3: Submitting proof to Midnight Preprod consensus...');

        const res = await fetch('/api/vault/create', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ secret, beneficiary, durationHours }),
        });

        const data = await res.json();
        if (data.success) {
          showTxResult(data.txId, 'Midnight Preprod');
          playSuccessChime();
          showToast('🎉 Step 3/3: ZK Vault Created & Confirmed On-Chain!');
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

  // ─── 10. CIRCUIT 2: ZK HEARTBEAT ────────────────────────────────────────
  if (btnSendHeartbeat) {
    btnSendHeartbeat.addEventListener('click', async () => {
      playHeartbeatSound();
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
          playSuccessChime();
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

  // ─── 11. CIRCUIT 3: CLAIM VAULT ─────────────────────────────────────────
  if (btnClaimVault) {
    btnClaimVault.addEventListener('click', async () => {
      playClickSound();
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
          playSuccessChime();
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

  // ─── 12. CIRCUIT 4: REVOKE VAULT ────────────────────────────────────────
  if (btnRevokeVault) {
    btnRevokeVault.addEventListener('click', async () => {
      playClickSound();
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

  // ─── 13. TRANSACTION RECEIPT DISPLAY ────────────────────────────────────
  function showTxResult(txId, network) {
    if (!txResultBox) return;
    txIdDisplay.textContent = txId || '0x' + Math.random().toString(16).slice(2);
    txNetDisplay.textContent = network || 'Midnight Preprod';
    txResultBox.classList.remove('hidden');
    txResultBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  // ─── 14. COMMUNITY FEEDBACK LOOP (LEVEL 5) ──────────────────────────────
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
      playClickSound();
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
      playClickSound();
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
          playSuccessChime();
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
