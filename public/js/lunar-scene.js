/**
 * Nocturne Vault - Interactive Three.js 3D Lunar Visualization
 * Procedurally generates realistic lunar regolith textures, impact craters,
 * orbital cryptographic dust rings, mouse parallax, and shockwave pulses.
 */

let threeScene = null;
let threeCamera = null;
let threeRenderer = null;
let lunarCore = null;
let orbitalRings = [];
let asteroidDust = null;
let starField = null;
let shockwaveRing = null;

let shockwaveActive = false;
let shockwaveScale = 1;

let isDragging = false;
let previousMousePos = { x: 0, y: 0 };
let mouseX = 0;
let mouseY = 0;
let targetCameraX = 0;
let targetCameraY = 0;
let moonVelocity = { x: 0, y: 0.0006 };

/**
 * Generates procedural realistic lunar surface & bump maps using HTML5 Canvas
 */
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

  const diffuseTex = new THREE.CanvasTexture(dCanvas);
  const bumpTex = new THREE.CanvasTexture(bCanvas);
  diffuseTex.wrapS = THREE.RepeatWrapping;
  diffuseTex.wrapT = THREE.ClampToEdgeWrapping;
  bumpTex.wrapS = THREE.RepeatWrapping;
  bumpTex.wrapT = THREE.ClampToEdgeWrapping;

  return { diffuseTex, bumpTex };
}

export function initThreeBackground() {
  const canvas = document.getElementById('bg-3d-canvas');
  if (!canvas || typeof THREE === 'undefined') return;

  threeScene = new THREE.Scene();
  threeCamera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
  threeCamera.position.z = 6.2;

  threeRenderer = new THREE.WebGLRenderer({
    canvas,
    alpha: true,
    antialias: true,
    powerPreference: 'high-performance'
  });
  threeRenderer.setSize(window.innerWidth, window.innerHeight);
  threeRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  // Lighting
  const ambientLight = new THREE.AmbientLight(0x28304a, 0.85);
  threeScene.add(ambientLight);

  // Main directional light (Sunlight grazing lunar limb)
  const sunLight = new THREE.DirectionalLight(0xffffff, 2.4);
  sunLight.position.set(6, 4, 4);
  threeScene.add(sunLight);

  // Cyberpunk secondary blue rim light
  const blueRim = new THREE.PointLight(0x00f2fe, 3.2, 18);
  blueRim.position.set(-6, -3, 2);
  threeScene.add(blueRim);

  // Deep purple fill
  const purpleFill = new THREE.PointLight(0x8a2be2, 2.4, 18);
  purpleFill.position.set(0, -6, -2);
  threeScene.add(purpleFill);

  // Generate Procedural Textures
  const { diffuseTex, bumpTex } = generateRealisticLunarMaps();

  // Create High-Poly Lunar Sphere
  const moonGeo = new THREE.SphereGeometry(1.85, 72, 72);
  const moonMat = new THREE.MeshStandardMaterial({
    map: diffuseTex,
    bumpMap: bumpTex,
    bumpScale: 0.08,
    roughness: 0.88,
    metalness: 0.12,
  });
  lunarCore = new THREE.Mesh(moonGeo, moonMat);
  lunarCore.position.set(0, 0.1, 0);
  threeScene.add(lunarCore);

  // Outer Atmospheric Lunar Glow
  const glowGeo = new THREE.SphereGeometry(1.92, 48, 48);
  const glowMat = new THREE.MeshBasicMaterial({
    color: 0x4facfe,
    transparent: true,
    opacity: 0.065,
    side: THREE.BackSide,
  });
  const glowMesh = new THREE.Mesh(glowGeo, glowMat);
  lunarCore.add(glowMesh);

  // Holographic Orbital Rings
  const ringDefs = [
    { radius: 2.8, tube: 0.009, color: 0x00f2fe, opacity: 0.45, rx: 1.1, ry: 0.4 },
    { radius: 3.3, tube: 0.007, color: 0x8a2be2, opacity: 0.35, rx: 0.8, ry: 1.2 },
    { radius: 3.8, tube: 0.006, color: 0x00f5a0, opacity: 0.28, rx: 1.4, ry: 0.7 },
  ];

  ringDefs.forEach(def => {
    const rGeo = new THREE.TorusGeometry(def.radius, def.tube, 16, 120);
    const rMat = new THREE.MeshBasicMaterial({
      color: def.color,
      transparent: true,
      opacity: def.opacity,
    });
    const ring = new THREE.Mesh(rGeo, rMat);
    ring.rotation.x = def.rx;
    ring.rotation.y = def.ry;
    threeScene.add(ring);
    orbitalRings.push(ring);
  });

  // Deep Starfield Background
  const starCount = 1200;
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

  // Mouse Interactions
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

export function trigger3DShockwave(color = 0x00f2fe) {
  if (!shockwaveRing) return;
  shockwaveRing.material.color.setHex(color);
  shockwaveRing.scale.set(1, 1, 1);
  shockwaveRing.material.opacity = 0.95;
  shockwaveScale = 1;
  shockwaveActive = true;
}

// Expose on window for global access
if (typeof window !== 'undefined') {
  window.trigger3DShockwave = trigger3DShockwave;
}

function animate() {
  requestAnimationFrame(animate);

  // Camera Parallax
  if (threeCamera) {
    threeCamera.position.x += (targetCameraX - threeCamera.position.x) * 0.04;
    threeCamera.position.y += (targetCameraY - threeCamera.position.y) * 0.04;
    threeCamera.lookAt(0, 0, 0);
  }

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

  if (threeRenderer && threeScene && threeCamera) {
    threeRenderer.render(threeScene, threeCamera);
  }
}
