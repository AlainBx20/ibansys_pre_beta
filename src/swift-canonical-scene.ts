/* eslint-disable */
// @ts-nocheck
import * as THREE from 'three'

const PALETTE = {
  navy: '#071b31',
  navy2: '#0b2d49',
  blue: '#1478B0',
  blue2: '#0A4C78',
  cyan: '#70D7E4',
  cyanSoft: '#B7EEF3',
  white: '#FFFFFF',
  silver: '#DDE6EA',
  silver2: '#AABBC4',
  muted: '#C7D9E1',
}

const COPY = {
  en: {
    inputs: [
      ['Application A', 'Core Banking'],
      ['Application B', 'Trade Finance'],
      ['Application C', 'Payments & Channels'],
    ],
    outputs: [
      ['SWIFT MT', 'Legacy messaging'],
      ['ISO 20022 / MX', 'Structured data'],
      ['Other Formats', 'Connected formats'],
    ],
    inputHeading: 'SOURCE APPLICATIONS', outputHeading: 'OUTPUT FORMATS',
    kicker: 'SWIFT+ · PIVOT LAYER', title: 'CANONICAL\nDATA MODEL',
    subtitle: 'One shared structure · Every format',
    stages: ['NORMALIZE', 'CONTROL', 'TRANSFORM'],
  },
  fr: {
    inputs: [
      ['Application A', 'Core Banking'],
      ['Application B', 'Trade Finance'],
      ['Application C', 'Paiements & canaux'],
    ],
    outputs: [
      ['SWIFT MT', 'Messagerie historique'],
      ['ISO 20022 / MX', 'Données structurées'],
      ['Autres formats', 'Formats connectés'],
    ],
    inputHeading: 'APPLICATIONS SOURCES', outputHeading: 'FORMATS DE SORTIE',
    kicker: 'SWIFT+ · COUCHE PIVOT', title: 'MODÈLE DE DONNÉES\nCANONIQUE',
    subtitle: 'Une structure commune · Tous les formats',
    stages: ['NORMALISER', 'CONTRÔLER', 'TRANSFORMER'],
  },
}

function canvasTexture(draw: (ctx: CanvasRenderingContext2D, size: number) => void, size = 768) {
  const canvas = document.createElement('canvas')
  canvas.width = canvas.height = size
  const ctx = canvas.getContext('2d')!
  draw(ctx, size)
  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  texture.anisotropy = 8
  return texture
}

function nodeTexture(_index: number, output: boolean) {
  const texture = canvasTexture((ctx, size) => {
    const g = ctx.createLinearGradient(0, 0, size, size)
    g.addColorStop(0, output ? '#F8FBFC' : '#FFFFFF')
    g.addColorStop(1, '#D8E3E8')
    ctx.fillStyle = g
    ctx.fillRect(0, 0, size, size)
    ctx.strokeStyle = '#9EAFB9'; ctx.lineWidth = 7
    ctx.beginPath(); ctx.arc(size / 2, size / 2, size * .34, 0, Math.PI * 2); ctx.stroke()
    ctx.fillStyle = output ? PALETTE.blue2 : PALETTE.blue
    ctx.beginPath(); ctx.arc(size / 2, size / 2, size * .092, 0, Math.PI * 2); ctx.fill()
    ctx.strokeStyle = output ? PALETTE.blue2 : PALETTE.blue; ctx.lineWidth = 11; ctx.lineCap = 'round'
    for (let spoke = 0; spoke < 3; spoke++) {
      const angle = spoke * Math.PI * 2 / 3 - Math.PI / 2
      ctx.beginPath()
      ctx.moveTo(size / 2 + Math.cos(angle) * size * .13, size / 2 + Math.sin(angle) * size * .13)
      ctx.lineTo(size / 2 + Math.cos(angle) * size * .245, size / 2 + Math.sin(angle) * size * .245)
      ctx.stroke()
      ctx.beginPath(); ctx.arc(size / 2 + Math.cos(angle) * size * .27, size / 2 + Math.sin(angle) * size * .27, size * .035, 0, Math.PI * 2); ctx.fill()
    }
  })
  texture.center.set(.5, .5)
  texture.rotation = Math.PI / 2
  return texture
}

function coreTexture() {
  return canvasTexture((ctx, size) => {
    const g = ctx.createLinearGradient(0, 0, size, size)
    g.addColorStop(0, '#1887BC'); g.addColorStop(.55, '#0D608E'); g.addColorStop(1, '#083C64')
    ctx.fillStyle = g; ctx.fillRect(0, 0, size, size)
    ctx.strokeStyle = 'rgba(255,255,255,.13)'; ctx.lineWidth = 4
    for (let i = 1; i < 5; i++) {
      ctx.beginPath(); ctx.roundRect(size * .08 * i, size * .08 * i, size * (1 - .16 * i), size * (1 - .16 * i), size * .05); ctx.stroke()
    }
  }, 1024)
}

function label(html: string, css = '') {
  const el = document.createElement('div')
  el.style.cssText = `position:absolute;left:0;top:0;pointer-events:none;${css}`
  el.innerHTML = html
  return el
}

class SwiftCanonicalScene extends HTMLElement {
  connectedCallback() {
    if (this._initialized) return
    this._initialized = true
    const locale = this.getAttribute('lang') === 'fr' ? 'fr' : 'en'
    const copy = COPY[locale]
    this.style.cssText += "display:block;position:relative;width:100%;height:100%;font-family:'Manrope',system-ui,sans-serif;"

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setPixelRatio(Math.min(devicePixelRatio, 2))
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = THREE.PCFSoftShadowMap
    renderer.outputColorSpace = THREE.SRGBColorSpace
    renderer.domElement.style.cssText = 'display:block;width:100%;height:100%;'
    this.appendChild(renderer.domElement)

    const labelLayer = document.createElement('div')
    labelLayer.style.cssText = 'position:absolute;inset:0;overflow:hidden;pointer-events:none;'
    this.appendChild(labelLayer)

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(31, 1, .1, 100)
    const target = new THREE.Vector3(0, .55, 0)
    scene.add(new THREE.HemisphereLight(0xeffaff, 0x385166, 1.25))
    const key = new THREE.DirectionalLight(0xffffff, 1.55)
    key.position.set(-6, 12, 9); key.castShadow = true; key.shadow.mapSize.set(2048, 2048)
    Object.assign(key.shadow.camera, { left: -10, right: 10, top: 8, bottom: -8, near: 1, far: 35 })
    key.shadow.camera.updateProjectionMatrix(); scene.add(key)
    const rim = new THREE.DirectionalLight(0x6adce9, .55); rim.position.set(8, 5, -6); scene.add(rim)

    const ground = new THREE.Mesh(new THREE.PlaneGeometry(24, 15), new THREE.ShadowMaterial({ color: 0x03101e, opacity: .3 }))
    ground.rotation.x = -Math.PI / 2; ground.position.y = -.06; ground.receiveShadow = true; scene.add(ground)

    const railMaterial = new THREE.MeshStandardMaterial({ color: PALETTE.cyan, emissive: PALETTE.blue2, emissiveIntensity: .35, roughness: .42 })
    const railDimMaterial = new THREE.MeshStandardMaterial({ color: '#49758B', emissive: '#0A314D', emissiveIntensity: .15, roughness: .6 })
    const paths = []
    const zRows = [-3.05, 0, 3.05]
    for (let i = 0; i < 3; i++) {
      const left = new THREE.CubicBezierCurve3(
        new THREE.Vector3(-4.55, .05, zRows[i]), new THREE.Vector3(-3.25, .05, zRows[i]),
        new THREE.Vector3(-3.15, .05, zRows[i] * .34), new THREE.Vector3(-2.15, .05, zRows[i] * .25),
      )
      const right = new THREE.CubicBezierCurve3(
        new THREE.Vector3(2.15, .05, zRows[i] * .25), new THREE.Vector3(3.15, .05, zRows[i] * .34),
        new THREE.Vector3(3.25, .05, zRows[i]), new THREE.Vector3(4.55, .05, zRows[i]),
      )
      ;[left, right].forEach((curve, side) => {
        const mesh = new THREE.Mesh(new THREE.TubeGeometry(curve, 48, .025, 8, false), railDimMaterial.clone())
        mesh.userData.route = i; scene.add(mesh); paths.push({ curve, mesh, route: i, side })
      })
    }

    const nodeTopMaterial = (index: number, output: boolean) => new THREE.MeshStandardMaterial({ map: nodeTexture(index, output), roughness: .58, metalness: .025 })
    const sideMat = new THREE.MeshStandardMaterial({ color: PALETTE.white, roughness: .72 })
    const lowerMat = new THREE.MeshStandardMaterial({ color: PALETTE.silver2, roughness: .8 })
    const baseMat = new THREE.MeshStandardMaterial({ color: PALETTE.blue2, roughness: .48 })
    const interactive = []
    const labels = []

    ;[-1, 1].forEach((direction) => {
      const output = direction === 1
      const data = output ? copy.outputs : copy.inputs
      data.forEach((item, index) => {
        const group = new THREE.Group()
        group.position.set(direction * 5.35, 0, zRows[index])
        const base = new THREE.Mesh(new THREE.CylinderGeometry(.82, .9, .18, 56), baseMat)
        base.position.y = .09; base.castShadow = true; group.add(base)
        const body = new THREE.Mesh(new THREE.CylinderGeometry(.82, .82, .42, 56), [sideMat, nodeTopMaterial(index, output), lowerMat])
        body.position.y = .37; body.castShadow = true; group.add(body)
        group.userData = { lift: 0, targetLift: 0, route: index }
        scene.add(group); interactive.push({ body, group, route: index, output })

        const align = output ? 'left' : 'right'
        const heading = `<b style="display:block;color:${PALETTE.cyanSoft};font-size:13px;line-height:1.28;font-weight:800;letter-spacing:.025em;text-shadow:0 2px 10px rgba(0,8,18,.85)">${item[0]}</b>`
        const detail = `<small style="display:block;margin-top:5px;color:${PALETTE.muted};font-size:11px;line-height:1.3;font-weight:550;text-shadow:0 2px 8px rgba(0,8,18,.85)">${item[1]}</small>`
        const el = label(heading + detail, `width:180px;text-align:${align};transition:opacity .2s ease,filter .2s ease;`)
        labelLayer.appendChild(el)
        labels.push({ el, anchor: new THREE.Vector3(direction * 6.15, .55, zRows[index]), output, route: index })
      })
    })

    const core = new THREE.Group()
    const coreBase = new THREE.Mesh(new THREE.BoxGeometry(4.55, .2, 3.75), new THREE.MeshStandardMaterial({ color: PALETTE.blue2, roughness: .52 }))
    coreBase.position.y = .1; coreBase.castShadow = true; core.add(coreBase)
    const coreBody = new THREE.Mesh(new THREE.BoxGeometry(4.3, .72, 3.5), [sideMat, sideMat, new THREE.MeshStandardMaterial({ map: coreTexture(), roughness: .48 }), lowerMat, sideMat, sideMat])
    coreBody.position.y = .54; coreBody.castShadow = true; core.add(coreBody)
    scene.add(core)

    const coreHalo = new THREE.Mesh(new THREE.BoxGeometry(4.78, .025, 3.98), new THREE.MeshBasicMaterial({ color: PALETTE.cyan, transparent: true, opacity: .3 }))
    coreHalo.position.y = .015; scene.add(coreHalo)

    const coreLabel = label(
      `<div style="color:${PALETTE.cyanSoft};font-size:10px;font-weight:850;letter-spacing:.16em">${copy.kicker}</div>` +
      `<div style="margin-top:9px;color:#fff;font-size:23px;line-height:1.08;font-weight:850;white-space:pre-line;text-shadow:0 3px 12px rgba(0,20,40,.45)">${copy.title}</div>` +
      `<div style="margin-top:8px;color:#D5EDF2;font-size:10.5px;font-weight:600">${copy.subtitle}</div>`,
      'width:290px;text-align:center;transform-origin:center;'
    )
    labelLayer.appendChild(coreLabel)
    const coreAnchor = new THREE.Vector3(0, .95, -.2)

    const stageAnchors = [-1.25, 0, 1.25].map((x, i) => {
      const plate = new THREE.Mesh(new THREE.BoxGeometry(1.02, .08, .58), new THREE.MeshStandardMaterial({ color: '#0A426A', emissive: '#126B91', emissiveIntensity: .2, roughness: .5 }))
      plate.position.set(x, .93, 1.05); plate.castShadow = true; core.add(plate)
      const el = label(`<span style="color:#75DBE6;font-size:7px;font-weight:850">0${i + 1}</span><b style="display:block;margin-top:3px;color:#fff;font-size:8px;letter-spacing:.04em">${copy.stages[i]}</b>`, 'width:100px;text-align:center;')
      labelLayer.appendChild(el)
      return { el, anchor: new THREE.Vector3(x, 1.02, 1.05), plate, offset: i * 2.15 }
    })

    const inputHeading = label(`<b>${copy.inputHeading}</b>`, `width:210px;text-align:right;color:${PALETTE.cyan};font-size:9px;font-weight:850;letter-spacing:.18em;`)
    const outputHeading = label(`<b>${copy.outputHeading}</b>`, `width:210px;text-align:left;color:${PALETTE.cyan};font-size:9px;font-weight:850;letter-spacing:.18em;`)
    labelLayer.append(inputHeading, outputHeading)
    const inputHeadingAnchor = new THREE.Vector3(-6.05, .4, -4.35)
    const outputHeadingAnchor = new THREE.Vector3(6.05, .4, -4.35)

    const packets = paths.map((path, index) => {
      const ball = new THREE.Mesh(new THREE.SphereGeometry(.075, 18, 14), new THREE.MeshBasicMaterial({ color: PALETTE.cyan }))
      ball.visible = false; scene.add(ball); return { ball, path, progress: index * 1.37 }
    })

    const ray = new THREE.Raycaster()
    const pointer = new THREE.Vector2(-9, -9)
    let active = null
    this.addEventListener('pointermove', (event) => {
      const rect = this.getBoundingClientRect()
      pointer.set(((event.clientX - rect.left) / rect.width) * 2 - 1, -((event.clientY - rect.top) / rect.height) * 2 + 1)
    })
    this.addEventListener('pointerleave', () => pointer.set(-9, -9))

    let width = 1000, height = 560
    const cameraDirection = new THREE.Vector3(0, 12.8, 12.5).normalize()
    const resize = () => {
      width = this.clientWidth || 1000; height = this.clientHeight || 560
      renderer.setSize(width, height, false); camera.aspect = width / height
      const distance = width < 620 ? 20.8 : width < 900 ? 19.3 : 17.6
      camera.position.copy(cameraDirection).multiplyScalar(distance).add(target)
      camera.lookAt(target); camera.updateProjectionMatrix()
    }
    resize()
    const ro = new ResizeObserver(resize); ro.observe(this)
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches
    const clock = new THREE.Clock()
    const projected = new THREE.Vector3()
    let raf = 0

    const place = (el, point, dx = 0, dy = 0, center = true) => {
      projected.copy(point).project(camera)
      const x = (projected.x * .5 + .5) * width + dx
      const y = (-projected.y * .5 + .5) * height + dy
      el.style.transform = `translate(${Math.round(x)}px,${Math.round(y)}px)${center ? ' translate(-50%,-50%)' : ''}`
    }

    const tick = () => {
      raf = requestAnimationFrame(tick)
      const dt = Math.min(clock.getDelta(), .05), time = clock.elapsedTime
      ray.setFromCamera(pointer, camera)
      const hit = ray.intersectObjects(interactive.map(n => n.body), false)[0]?.object || null
      const found = interactive.find(n => n.body === hit) || null
      if (found !== active) {
        active = found
        interactive.forEach(n => n.group.userData.targetLift = n === found ? .28 : 0)
        paths.forEach(p => {
          const on = !found || (p.route === found.route && p.side === (found.output ? 1 : 0))
          p.mesh.material.color.set(on ? PALETTE.cyan : '#34566C')
          p.mesh.material.emissive.set(on ? PALETTE.blue2 : '#071B31')
          p.mesh.material.opacity = on ? 1 : .35; p.mesh.material.transparent = !on
        })
        labels.forEach(l => { l.el.style.opacity = !found || (l.route === found.route && l.output === found.output) ? '1' : '.45' })
        this.style.cursor = found ? 'pointer' : 'default'
      }
      interactive.forEach(n => {
        const d = n.group.userData
        d.lift += (d.targetLift - d.lift) * Math.min(1, dt * 9)
        n.group.position.y = d.lift
      })

      if (!reduce) {
        core.position.y = Math.sin(time * .8) * .025
        coreHalo.material.opacity = .22 + .12 * (.5 + .5 * Math.sin(time * 1.4))
        stageAnchors.forEach(s => {
          const pulse = .5 + .5 * Math.sin(time * 1.25 - s.offset)
          s.plate.material.emissiveIntensity = .14 + pulse * .38
        })
        packets.forEach(packet => {
          packet.progress = (packet.progress + dt) % 9.4
          const selected = !active || (packet.path.route === active.route && packet.path.side === (active.output ? 1 : 0))
          packet.ball.visible = selected && packet.progress < 6.2
          if (packet.ball.visible) {
            packet.ball.position.copy(packet.path.curve.getPoint(packet.progress / 6.2))
          }
        })
      }

      renderer.render(scene, camera)
      labels.forEach(l => {
        projected.copy(l.anchor).project(camera)
        const x = (projected.x * .5 + .5) * width
        const y = (-projected.y * .5 + .5) * height
        l.el.style.transform = `translate(${Math.round(x + (l.output ? 14 : -194))}px,${Math.round(y - 20)}px)`
      })
      place(coreLabel, coreAnchor, 0, -4)
      stageAnchors.forEach(s => place(s.el, s.anchor, 0, 1))
      place(inputHeading, inputHeadingAnchor, -205, -10, false)
      place(outputHeading, outputHeadingAnchor, 12, -10, false)
    }
    tick()
    this._stop = () => {
      cancelAnimationFrame(raf); ro.disconnect(); renderer.dispose(); renderer.forceContextLoss()
      scene.traverse(object => {
        if (object.geometry) object.geometry.dispose()
        if (object.material) (Array.isArray(object.material) ? object.material : [object.material]).forEach(material => { material.map?.dispose(); material.dispose() })
      })
    }
  }

  disconnectedCallback() { this._stop?.() }
}

if (!customElements.get('swift-canonical-3d')) customElements.define('swift-canonical-3d', SwiftCanonicalScene)
