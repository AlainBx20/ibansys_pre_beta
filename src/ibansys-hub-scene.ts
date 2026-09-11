/* eslint-disable */
// @ts-nocheck
import * as THREE from "three";

const C = {
  ink0: "#FFFFFF", ink25: "#FAFBFC", ink50: "#F4F6F8", ink100: "#E9EDF1",
  ink200: "#D6E6EC", ink300: "#AFC8D3", ink400: "#8CA8B6", ink500: "#7595A5", ink600: "#AFC7D2",
  ink700: "#34536A", ink800: "#173A53", ink900: "#091D34",
  teal50: "#EAF7FA", teal100: "#D7EEF4", teal200: "#8BC9D8", teal300: "#59C3D4",
  teal400: "#319EBC", teal500: "#1478B0", teal600: "#0D5B87", teal700: "#093D62",
  cyan: "#A0ECF4", label: "#F4FAFC", labelMuted: "#D3E5EC",
  citron: "#59C3D4",
};

// angle in degrees on the ring, side drives label alignment
const NODE_COPY = {
  fr: [
    { t: "SWIFT+ Messaging Hub", s: "Échange de données", a: 90, side: "center-top", icon: "share", tone: "teal" },
    { t: "Lutte anti-blanchiment & conformité", s: "API / Services", a: 30, side: "right", icon: "check", tone: "ink" },
    { t: "Dépositaire central", s: "Déclarations réglementaires (IN/OUT)", a: -30, side: "right", icon: "globe", tone: "teal" },
    { t: "Reporting & BI", s: "Échange de données", a: -90, side: "center-bottom", icon: "trend", tone: "ink" },
    { t: "Systèmes de paiement", s: "Échange de données", a: -150, side: "left", icon: "sliders", tone: "teal" },
    { t: "Système bancaire central", s: "API / Services", a: 150, side: "left", icon: "sparkle", tone: "ink" },
  ],
  en: [
    { t: "SWIFT+ Messaging Hub", s: "Data exchange", a: 90, side: "center-top", icon: "share", tone: "teal" },
    { t: "AML & Compliance", s: "API / Services", a: 30, side: "right", icon: "check", tone: "ink" },
    { t: "Central Securities Depository", s: "Regulatory reporting (IN/OUT)", a: -30, side: "right", icon: "globe", tone: "teal" },
    { t: "Reporting & BI", s: "Data exchange", a: -90, side: "center-bottom", icon: "trend", tone: "ink" },
    { t: "Payment Systems", s: "Data exchange", a: -150, side: "left", icon: "sliders", tone: "teal" },
    { t: "Core Banking System", s: "API / Services", a: 150, side: "left", icon: "sparkle", tone: "ink" },
  ],
};
const R_RING = 4.8, R_PUCK = 1.05, H_PUCK = 0.44, R_CORE = 2.2, H_CORE = 0.64;

function drawIcon(ctx, kind, x, y, size, color, weight) {
  ctx.save();
  ctx.translate(x, y);
  ctx.strokeStyle = color; ctx.lineWidth = size * (weight || 0.085);
  ctx.lineCap = "round"; ctx.lineJoin = "round";
  const u = size / 2;
  if (kind === "sparkle") {
    ctx.beginPath();
    ctx.moveTo(0, -u); ctx.lineTo(u * 0.25, -u * 0.25); ctx.lineTo(u, 0);
    ctx.lineTo(u * 0.25, u * 0.25); ctx.lineTo(0, u); ctx.lineTo(-u * 0.25, u * 0.25);
    ctx.lineTo(-u, 0); ctx.lineTo(-u * 0.25, -u * 0.25); ctx.closePath(); ctx.stroke();
  } else if (kind === "check") {
    ctx.beginPath(); ctx.roundRect(-u * 0.85, -u * 0.85, u * 1.7, u * 1.7, u * 0.22); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(-u * 0.4, 0); ctx.lineTo(-u * 0.05, u * 0.38); ctx.lineTo(u * 0.5, -u * 0.4); ctx.stroke();
  } else if (kind === "trend") {
    ctx.beginPath(); ctx.moveTo(-u * 0.85, u * 0.6); ctx.lineTo(-u * 0.1, -u * 0.2);
    ctx.lineTo(u * 0.3, u * 0.15); ctx.lineTo(u * 0.85, -u * 0.7); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(u * 0.35, -u * 0.7); ctx.lineTo(u * 0.85, -u * 0.7); ctx.lineTo(u * 0.85, -u * 0.2); ctx.stroke();
  } else if (kind === "share") {
    ctx.beginPath(); ctx.moveTo(-u * 0.62, 0); ctx.lineTo(u * 0.62, -u * 0.62); ctx.moveTo(-u * 0.62, 0); ctx.lineTo(u * 0.62, u * 0.62); ctx.stroke();
    [[u * 0.62, -u * 0.62], [u * 0.62, u * 0.62], [-u * 0.62, 0]].forEach(([a, b]) => {
      ctx.beginPath(); ctx.arc(a, b, u * 0.26, 0, Math.PI * 2); ctx.stroke();
    });
  } else if (kind === "globe") {
    ctx.beginPath(); ctx.arc(0, 0, u * 0.85, 0, Math.PI * 2); ctx.stroke();
    ctx.beginPath(); ctx.ellipse(0, 0, u * 0.35, u * 0.85, 0, 0, Math.PI * 2); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(-u * 0.85, 0); ctx.lineTo(u * 0.85, 0); ctx.stroke();
  } else {
    [[-u * 0.5, u * 0.3], [u * 0.05, -u * 0.25], [u * 0.6, u * 0.15]].forEach(([yy, cx]) => {
      ctx.beginPath(); ctx.moveTo(-u * 0.8, yy); ctx.lineTo(u * 0.8, yy); ctx.stroke();
      ctx.beginPath(); ctx.arc(cx, yy, u * 0.19, 0, Math.PI * 2); ctx.stroke();
    });
  }
  ctx.restore();
}

function puckTopTexture(node) {
  const S = 512;
  const cv = document.createElement("canvas");
  cv.width = cv.height = S;
  const ctx = cv.getContext("2d");
  ctx.fillStyle = C.ink0; ctx.fillRect(0, 0, S, S);
  const c = S / 2;
  // inset disc
  const inset = S * 0.33;
  const g = ctx.createLinearGradient(c - inset, c - inset, c + inset, c + inset);
  if (node.tone === "teal") { g.addColorStop(0, C.teal500); g.addColorStop(1, C.teal700); }
  else { g.addColorStop(0, C.ink200); g.addColorStop(1, C.ink300); }
  ctx.fillStyle = g;
  ctx.beginPath(); ctx.arc(c, c, inset, 0, Math.PI * 2); ctx.fill();
  ctx.strokeStyle = node.tone === "teal" ? "rgba(255,255,255,.35)" : C.ink300;
  ctx.lineWidth = 3;
  ctx.beginPath(); ctx.arc(c, c, inset - 8, 0, Math.PI * 2); ctx.stroke();
  drawIcon(ctx, node.icon, c, c, S * 0.3, node.tone === "teal" ? "#FFFFFF" : C.ink600 || C.ink500, 0.075);
  const t = new THREE.CanvasTexture(cv);
  t.anisotropy = 8; t.colorSpace = THREE.SRGBColorSpace;
  t.center.set(0.5, 0.5);
  t.rotation = Math.PI / 2;
  return t;
}

function coreTopTexture() {
  const S = 1024;
  const cv = document.createElement("canvas");
  cv.width = cv.height = S;
  const ctx = cv.getContext("2d");
  ctx.fillStyle = C.ink0; ctx.fillRect(0, 0, S, S);
  const c = S / 2;
  const g = ctx.createLinearGradient(c - 380, c - 300, c + 380, c + 340);
  g.addColorStop(0, C.teal500); g.addColorStop(1, C.teal700);
  ctx.fillStyle = g;
  ctx.beginPath(); ctx.arc(c, c, S * 0.455, 0, Math.PI * 2); ctx.fill();
  ctx.strokeStyle = "rgba(255,255,255,.3)"; ctx.lineWidth = 4;
  ctx.beginPath(); ctx.arc(c, c, S * 0.4, 0, Math.PI * 2); ctx.stroke();
  ctx.strokeStyle = "rgba(255,255,255,.14)"; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.arc(c, c, S * 0.325, 0, Math.PI * 2); ctx.stroke();
  const t = new THREE.CanvasTexture(cv);
  t.anisotropy = 8; t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

class HubScene extends HTMLElement {
  connectedCallback() {
    if (this._init) return;
    this._init = true;
    const nodes = NODE_COPY[this.getAttribute("lang") === "en" ? "en" : "fr"];
    this.style.display = "block";
    this.style.position = "relative";
    this.style.width = "100%";
    this.style.height = "100%";
    this.style.fontFamily = "'Manrope', system-ui, sans-serif";

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    const cvs = renderer.domElement;
    cvs.style.cssText = "display:block;width:100%;height:100%;";
    this.appendChild(cvs);

    const labelLayer = document.createElement("div");
    labelLayer.style.cssText = "position:absolute;inset:0;pointer-events:none;";
    this.appendChild(labelLayer);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 120);
    const camTarget = new THREE.Vector3(0, 1.25, 0);

    scene.add(new THREE.HemisphereLight(0xffffff, 0xd8e1e8, 0.9));
    const key = new THREE.DirectionalLight(0xffffff, 1.15);
    key.position.set(-6, 12, 7);
    key.castShadow = true;
    key.shadow.mapSize.set(2048, 2048);
    Object.assign(key.shadow.camera, { left: -9, right: 9, top: 9, bottom: -9, near: 1, far: 34 });
    key.shadow.camera.updateProjectionMatrix();
    scene.add(key);
    const fill = new THREE.DirectionalLight(0xffffff, 0.4);
    fill.position.set(7, 6, -6);
    scene.add(fill);

    const ground = new THREE.Mesh(
      new THREE.PlaneGeometry(26, 20),
      new THREE.ShadowMaterial({ color: 0x0b2530, opacity: 0.17 })
    );
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    scene.add(ground);

    // connecting ring
    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(R_RING - R_PUCK - 0.32, 0.018, 8, 200),
      new THREE.MeshBasicMaterial({ color: C.teal300 })
    );
    ring.rotation.x = -Math.PI / 2;
    ring.position.y = 0.012;
    scene.add(ring);
    const ringR = R_RING - R_PUCK - 0.32;

    const whiteSide = new THREE.MeshStandardMaterial({ color: C.ink0, roughness: 0.72, metalness: 0.02 });
    const whiteBottom = new THREE.MeshStandardMaterial({ color: C.ink100, roughness: 0.9, metalness: 0 });
    const tealBase = new THREE.MeshStandardMaterial({ color: C.teal600, roughness: 0.55, metalness: 0.05 });
    const inkBase = new THREE.MeshStandardMaterial({ color: C.ink300, roughness: 0.7, metalness: 0 });

    const pucks = [];
    const labels = [];
    nodes.forEach((node) => {
      const rad = (node.a * Math.PI) / 180;
      const pos = new THREE.Vector3(Math.cos(rad) * R_RING, 0, -Math.sin(rad) * R_RING);

      const grp = new THREE.Group();
      grp.position.copy(pos);

      const base = new THREE.Mesh(
        new THREE.CylinderGeometry(R_PUCK * 1.07, R_PUCK * 1.07, 0.14, 64),
        node.tone === "teal" ? tealBase : inkBase
      );
      base.position.y = 0.07;
      base.castShadow = true;
      base.name = "base";
      grp.add(base);

      const body = new THREE.Mesh(
        new THREE.CylinderGeometry(R_PUCK, R_PUCK, H_PUCK, 64),
        [whiteSide, new THREE.MeshStandardMaterial({ map: puckTopTexture(node), roughness: 0.62, metalness: 0.02 }), whiteBottom]
      );
      body.position.y = 0.14 + H_PUCK / 2;
      body.castShadow = true;
      grp.add(body);

      grp.userData = { lift: 0, target: 0, node };
      scene.add(grp);
      pucks.push({ grp, hit: body, node, pos, rad });

      // radial rail: core edge -> puck edge
      const rIn = R_CORE * 1.1, rOut = R_RING - R_PUCK * 1.07;
      const railLen = rOut - rIn;
      const railMid = (rIn + rOut) / 2;
      const rail = new THREE.Mesh(
        new THREE.BoxGeometry(railLen, 0.02, 0.026),
        new THREE.MeshStandardMaterial({ color: C.teal200, roughness: 0.8, metalness: 0 })
      );
      rail.position.set(Math.cos(rad) * railMid, 0.025, -Math.sin(rad) * railMid);
      rail.rotation.y = rad;
      scene.add(rail);

      const knot = new THREE.Mesh(
        new THREE.CylinderGeometry(0.046, 0.046, 0.022, 24),
        new THREE.MeshBasicMaterial({ color: C.teal300, transparent: true, opacity: 0.62 })
      );
      knot.position.set(Math.cos(rad) * ringR, 0.035, -Math.sin(rad) * ringR);
      scene.add(knot);

      const collar = new THREE.Mesh(
        new THREE.CylinderGeometry(0.034, 0.034, 0.022, 20),
        new THREE.MeshBasicMaterial({ color: C.teal300, transparent: true, opacity: 0.5 })
      );
      collar.position.set(Math.cos(rad) * rOut, 0.035, -Math.sin(rad) * rOut);
      scene.add(collar);

      // label
      const el = document.createElement("div");
      const align = node.side === "left" ? "right" : node.side === "right" ? "left" : "center";
      el.style.cssText = `position:absolute;width:186px;text-align:${align};transform-origin:0 0;transition:opacity 140ms cubic-bezier(.2,0,.2,1);`;
      el.innerHTML =
        `<div style="font-size:13px;font-weight:700;letter-spacing:.07em;text-transform:uppercase;color:${C.cyan};line-height:1.34;text-shadow:0 2px 12px rgba(0,9,20,.72);">${node.t}</div>` +
        `<div style="margin-top:5px;font-size:12.5px;font-weight:520;line-height:18px;color:${C.labelMuted};text-shadow:0 2px 10px rgba(0,9,20,.76);">${node.s}</div>`;
      labelLayer.appendChild(el);
      labels.push({ el, node, anchor: new THREE.Vector3(Math.cos(rad) * (R_RING + R_PUCK * 1.6), 0.55, -Math.sin(rad) * (R_RING + R_PUCK * 1.5)) });
    });

    // core
    const core = new THREE.Group();
    const coreBase = new THREE.Mesh(
      new THREE.CylinderGeometry(R_CORE * 1.06, R_CORE * 1.06, 0.16, 72), tealBase
    );
    coreBase.position.y = 0.08;
    coreBase.castShadow = true;
    core.add(coreBase);
    const coreBody = new THREE.Mesh(
      new THREE.CylinderGeometry(R_CORE, R_CORE, H_CORE, 72),
      [whiteSide, new THREE.MeshStandardMaterial({ map: coreTopTexture(), roughness: 0.55, metalness: 0.03 }), whiteBottom]
    );
    coreBody.position.y = 0.16 + H_CORE / 2;
    coreBody.castShadow = true;
    core.add(coreBody);
    scene.add(core);

    const halo = new THREE.Mesh(
      new THREE.RingGeometry(R_CORE * 1.14, R_CORE * 1.19, 96),
      new THREE.MeshBasicMaterial({ color: C.teal400, transparent: true, opacity: 0.28, side: THREE.DoubleSide })
    );
    halo.rotation.x = -Math.PI / 2;
    halo.position.y = 0.008;
    scene.add(halo);

    const coreLabel = document.createElement("div");
    coreLabel.style.cssText = "position:absolute;left:0;top:0;text-align:center;white-space:nowrap;";
    coreLabel.innerHTML =
      '<div style="font-size:25px;font-weight:700;letter-spacing:.04em;color:#FFFFFF;line-height:1;">IBANSYS</div>' +
      '<div style="margin-top:6px;font-size:12px;font-weight:500;letter-spacing:.02em;color:rgba(255,255,255,.9);line-height:1;">API · Services · Data</div>';
    labelLayer.appendChild(coreLabel);
    const coreAnchor = new THREE.Vector3(0, 0.16 + H_CORE + 0.01, 0);

    // One calm packet circles the network. A second packet appears only on hover.
    const ringPulse = new THREE.Mesh(
      new THREE.SphereGeometry(0.062, 16, 12),
      new THREE.MeshBasicMaterial({ color: C.citron })
    );
    ringPulse.position.set(ringR, 0.05, 0);
    scene.add(ringPulse);
    let ringTime = 0;

    const hoverPulse = new THREE.Mesh(
      new THREE.SphereGeometry(0.072, 16, 12),
      new THREE.MeshBasicMaterial({ color: C.cyan })
    );
    hoverPulse.visible = false;
    scene.add(hoverPulse);
    let hoverTarget = null;
    let hoverProgress = 1;

    const ray = new THREE.Raycaster();
    const ptr = new THREE.Vector2(-9, -9);
    let hovered = null;
    this.addEventListener("pointermove", (e) => {
      const r = this.getBoundingClientRect();
      ptr.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
    });
    this.addEventListener("pointerleave", () => ptr.set(-9, -9));

    let w = 960, h = 500;
    let labelPad = 200;

    // sample the silhouette so the camera can be fitted to the frame
    const fitPts = [];
    nodes.forEach((n) => {
      const a = (n.a * Math.PI) / 180;
      const spread = Math.atan(R_PUCK * 1.12 / R_RING);
      [a - spread, a, a + spread].forEach((aa) => {
        [R_RING - R_PUCK * 1.12, R_RING, R_RING + R_PUCK * 1.12].forEach((rr) => {
          [0, H_PUCK + 0.2].forEach((yy) => fitPts.push(new THREE.Vector3(Math.cos(aa) * rr, yy, -Math.sin(aa) * rr)));
        });
      });
    });
    fitPts.push(new THREE.Vector3(0, H_CORE + 0.2, 0));

    const dir = new THREE.Vector3(0, 11.2, 10.6).normalize();
    const tmp = new THREE.Vector3();
    const fit = () => {
      let d = 17;
      for (let i = 0; i < 7; i++) {
        camera.position.copy(dir).multiplyScalar(d).add(camTarget);
        camera.lookAt(camTarget);
        camera.updateMatrixWorld();
        camera.updateProjectionMatrix();
        let minX = 1e9, maxX = -1e9, minY = 1e9, maxY = -1e9;
        fitPts.forEach((p) => {
          tmp.copy(p).project(camera);
          minX = Math.min(minX, tmp.x); maxX = Math.max(maxX, tmp.x);
          minY = Math.min(minY, tmp.y); maxY = Math.max(maxY, tmp.y);
        });
        const ax = Math.max(0.32, (w - 2 * labelPad) / w);
        const ay = Math.max(0.4, (h - 96) / h);
        const needX = Math.max(Math.abs(minX), Math.abs(maxX)) / ax;
        const needY = Math.max(Math.abs(minY), Math.abs(maxY)) / ay;
        const k = Math.max(needX, needY);
        const mid = (minY + maxY) / 2;
        const Hv = d * Math.tan((camera.fov * Math.PI) / 360);
        camTarget.y += mid * Hv * 0.85;
        camTarget.y = Math.max(-1, Math.min(4, camTarget.y));
        d *= 0.6 + 0.4 * k + (k - 1) * 0.6;
        d = Math.max(9, Math.min(46, d));
      }
      camera.position.copy(dir).multiplyScalar(d).add(camTarget);
      camera.lookAt(camTarget);
      camera.updateProjectionMatrix();
    };

    const resize = () => {
      w = this.clientWidth || 960;
      h = this.clientHeight || 500;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      labelPad = w < 620 ? 128 : w < 900 ? 198 : 214;
      camTarget.set(0, 1.2, 0);
      fit();
    };
    resize();
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(this);

    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const clock = new THREE.Clock();
    const v = new THREE.Vector3();
    let raf;
    const tick = () => {
      raf = requestAnimationFrame(tick);
      const dt = Math.min(clock.getDelta(), 0.05);
      const el = clock.elapsedTime;

      if (!reduce) {
        ringTime = (ringTime + dt) % 12;
        ringPulse.visible = ringTime < 10;
        if (ringPulse.visible) {
          const a = (ringTime / 10) * Math.PI * 2;
          ringPulse.position.set(Math.cos(a) * ringR, 0.05, -Math.sin(a) * ringR);
        }
        if (hoverTarget && hoverProgress < 1) {
          hoverProgress = Math.min(1, hoverProgress + dt / 1.2);
          const eased = 1 - Math.pow(1 - hoverProgress, 3);
          const r = R_CORE * 1.1 + (R_RING - R_PUCK * 1.07 - R_CORE * 1.1) * eased;
          hoverPulse.position.set(Math.cos(hoverTarget.rad) * r, 0.075, -Math.sin(hoverTarget.rad) * r);
          hoverPulse.visible = hoverProgress < 1;
        }
        halo.material.opacity = 0.18 + 0.14 * (0.5 + 0.5 * Math.sin(el * 1.4));
        core.position.y = 0.03 * Math.sin(el * 0.9);
      }

      ray.setFromCamera(ptr, camera);
      const hit = ray.intersectObjects(pucks.map((p) => p.hit), false)[0];
      const next = hit ? hit.object : null;
      if (next !== hovered) {
        pucks.forEach((p) => (p.grp.userData.target = 0));
        const found = pucks.find((p) => p.hit === next);
        if (found) {
          found.grp.userData.target = 0.3;
          hoverTarget = found;
          hoverProgress = 0;
          hoverPulse.visible = !reduce;
        } else {
          hoverTarget = null;
          hoverPulse.visible = false;
        }
        hovered = next;
        this.style.cursor = next ? "pointer" : "default";
        labels.forEach((l) => {
          l.el.style.opacity = !found || l.node === found.node ? "1" : "0.78";
        });
      }
      pucks.forEach((p) => {
        const u = p.grp.userData;
        u.lift += (u.target - u.lift) * Math.min(1, dt * 9);
        p.grp.position.y = u.lift;
      });


      renderer.render(scene, camera);

      labels.forEach((l) => {
        v.copy(l.anchor).project(camera);
        const x = (v.x * 0.5 + 0.5) * w;
        const y = (-v.y * 0.5 + 0.5) * h;
        const side = l.node.side;
        const lh = l.el.offsetHeight || 40;
        const lx = side === "left" ? 10 : side === "right" ? w - 196 : x - 93;
        const rawY = side === "center-top" ? 8 : side === "center-bottom" ? h - lh - 8 : y - lh / 2;
        const ly = Math.max(6, Math.min(h - lh - 6, rawY));
        l.el.style.transform = `translate(${Math.round(lx)}px, ${Math.round(ly)}px)`;
      });

      v.copy(coreAnchor).project(camera);
      coreLabel.style.transform = `translate(${Math.round((v.x * 0.5 + 0.5) * w)}px, ${Math.round((-v.y * 0.5 + 0.5) * h)}px) translate(-50%, -50%)`;
    };
    tick();
    this._stop = () => {
      cancelAnimationFrame(raf);
      resizeObserver.disconnect();
      renderer.dispose();
      renderer.forceContextLoss();
    };
  }
  disconnectedCallback() { this._stop && this._stop(); }
}

if (!customElements.get("ibansys-hub-3d")) customElements.define("ibansys-hub-3d", HubScene);
