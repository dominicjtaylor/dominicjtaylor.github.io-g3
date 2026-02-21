"use client"

import { useEffect, useRef, useCallback } from "react"

export function WebGLBackground() {
  const containerRef = useRef<HTMLDivElement>(null)
  const cleanupRef = useRef<(() => void) | null>(null)

  const initScene = useCallback(async () => {
    if (!containerRef.current) return

    const THREE = await import("three")
    const { EffectComposer } = await import(
      "three/examples/jsm/postprocessing/EffectComposer.js"
    )
    const { RenderPass } = await import(
      "three/examples/jsm/postprocessing/RenderPass.js"
    )
    const { UnrealBloomPass } = await import(
      "three/examples/jsm/postprocessing/UnrealBloomPass.js"
    )

    // --- Setup ---
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(
      70,
      window.innerWidth / window.innerHeight,
      0.1,
      200
    )
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true })
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setClearColor(0x090b10, 0.6)

    containerRef.current.innerHTML = ""
    containerRef.current.appendChild(renderer.domElement)

    // Postprocessing (Bloom)
    const composer = new EffectComposer(renderer)
    composer.addPass(new RenderPass(scene, camera))
    const bloomPass = new UnrealBloomPass(
      new THREE.Vector2(window.innerWidth, window.innerHeight),
      0.9,
      0.4,
      0.6
    )
    composer.addPass(bloomPass)

    // --- Helpers ---
    function randomUnitVector() {
      const z = 2 * Math.random() - 1
      const t = 2 * Math.PI * Math.random()
      const r = Math.sqrt(1 - z * z)
      return new THREE.Vector3(r * Math.cos(t), r * Math.sin(t), z)
    }

    function randomOnSphere(radius: number) {
      return randomUnitVector().multiplyScalar(radius)
    }

    // --- Network Globe ---
    const radius = 22
    const group = new THREE.Group()

    // Orbital arc ring - refined thin ring
    const arcAngle = Math.PI * 2
    const ringGeo = new THREE.RingGeometry(
      radius * 1.01,
      radius * 1.025,
      200,
      1,
      0,
      arcAngle
    )
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.35,
    })
    const orbitalArc = new THREE.Mesh(ringGeo, ringMat)
    orbitalArc.rotation.x = Math.PI / 4
    group.add(orbitalArc)

    // Second subtle ring at different angle
    const ringGeo2 = new THREE.RingGeometry(
      radius * 1.03,
      radius * 1.04,
      180,
      1,
      0,
      arcAngle
    )
    const ringMat2 = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.15,
    })
    const orbitalArc2 = new THREE.Mesh(ringGeo2, ringMat2)
    orbitalArc2.rotation.x = -Math.PI / 3
    orbitalArc2.rotation.y = Math.PI / 5
    group.add(orbitalArc2)

    // Nodes - all white
    const nodeMaterial = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      emissive: 0xffffff,
      emissiveIntensity: 0.8,
    })
    const nodeGeometry = new THREE.SphereGeometry(0.13, 8, 8)

    interface NodeMesh extends THREE.Mesh {
      material: THREE.MeshStandardMaterial
    }

    const nodes: NodeMesh[] = []
    const numClusters = 80
    const nodesPerCluster = 50

    for (let c = 0; c < numClusters; c++) {
      const clusterCenter = randomOnSphere(radius)
      const clusterMaterial = nodeMaterial.clone()
      // All white with very slight warmth variation for depth
      const warmth = 0.95 + Math.random() * 0.05
      clusterMaterial.color.setRGB(warmth, warmth, 1.0)
      clusterMaterial.emissive.setRGB(warmth, warmth, 1.0)
      clusterMaterial.emissiveIntensity = 0.6 + Math.random() * 0.4

      for (let i = 0; i < nodesPerCluster; i++) {
        const jitterRatio = Math.random() * 0.2
        const jitter = randomUnitVector().multiplyScalar(
          jitterRatio * radius * Math.random()
        )
        const pos = clusterCenter
          .clone()
          .add(jitter)
          .normalize()
          .multiplyScalar(radius)

        const node = new THREE.Mesh(nodeGeometry, clusterMaterial) as NodeMesh
        node.position.copy(pos)
        nodes.push(node)
        group.add(node)
      }
    }

    // Edges + particle flow
    const edges = new THREE.Group()
    const edgeMaterial = new THREE.LineBasicMaterial({
      transparent: true,
      opacity: 0.12,
      color: 0xddeeff,
    })

    interface EdgeData {
      a: THREE.Vector3
      b: THREE.Vector3
      particle: THREE.Mesh
      progress: number
    }

    const edgeDataList: EdgeData[] = []
    const lineCount = Math.floor(nodes.length * 0.05)

    for (let i = 0; i < lineCount; i++) {
      const a = nodes[Math.floor(Math.random() * nodes.length)]
      const b = nodes[Math.floor(Math.random() * nodes.length)]
      if (a === b) continue

      const geom = new THREE.BufferGeometry().setFromPoints([
        a.position,
        b.position,
      ])
      const line = new THREE.Line(geom, edgeMaterial)
      edges.add(line)

      const particleGeom = new THREE.SphereGeometry(0.08, 8, 8)
      const particleMat = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        transparent: true,
      })
      const particle = new THREE.Mesh(particleGeom, particleMat)
      group.add(particle)

      edgeDataList.push({
        a: a.position.clone(),
        b: b.position.clone(),
        particle,
        progress: Math.random(),
      })
    }

    group.add(edges)
    scene.add(group)

    // --- Lighting ---
    scene.add(new THREE.AmbientLight(0xffffff, 0.8))
    const dirLight = new THREE.DirectionalLight(0xeef4ff, 1.2)
    dirLight.position.set(50, 100, 100)
    scene.add(dirLight)
    // Subtle rim light for depth
    const rimLight = new THREE.DirectionalLight(0xaaccff, 0.4)
    rimLight.position.set(-50, -30, -60)
    scene.add(rimLight)

    // --- Camera States per section ---
    const cameraStates = [
      {
        pivot: new THREE.Vector3(0, 0, 0),
        offset: new THREE.Vector3(-10, 15, -100),
      },
      {
        pivot: new THREE.Vector3(0, 0, 0),
        offset: new THREE.Vector3(5, 15, 10),
        subdued: true,
      },
    ]

    let currentSection = 0
    let targetOpacity = 0.85

    const handleScroll = () => {
      const scrollY = window.scrollY
      const vh = window.innerHeight
      const sectionIndex = scrollY / vh
      // Faster camera zoom: multiply section progress for quicker transitions
      currentSection = Math.min(
        cameraStates.length - 1,
        Math.max(0, sectionIndex * 1.6)
      )

      // Fade WebGL - keep brighter longer
      const fadeStart = 0.4
      const fadeEnd = 2.0
      if (sectionIndex <= fadeStart) {
        targetOpacity = 0.85
      } else if (sectionIndex >= fadeEnd) {
        targetOpacity = 0.1
      } else {
        targetOpacity = 0.85 - ((sectionIndex - fadeStart) / (fadeEnd - fadeStart)) * 0.75
      }
    }

    window.addEventListener("scroll", handleScroll, { passive: true })

    // --- Animation Loop ---
    const clock = new THREE.Clock()
    let animationId: number
    let currentOpacity = 0.85

    function animate() {
      animationId = requestAnimationFrame(animate)
      const delta = clock.getDelta()

      // Smooth camera transitions - faster lerp for quicker zoom
      const prevIdx = Math.floor(currentSection)
      const nextIdx = Math.min(cameraStates.length - 1, Math.ceil(currentSection))
      const t = currentSection % 1
      const prev = cameraStates[prevIdx]
      const next = cameraStates[nextIdx]

      const desiredPos = new THREE.Vector3().lerpVectors(
        prev.offset.clone().add(prev.pivot),
        next.offset.clone().add(next.pivot),
        t
      )
      camera.position.lerp(desiredPos, 0.08)

      const lookTarget = new THREE.Vector3().lerpVectors(
        prev.pivot,
        next.pivot,
        t
      )
      camera.lookAt(lookTarget)

      // Rotate globe slowly
      group.rotation.y += delta * 0.08

      // Determine particle speed & opacity for current section
      const state = cameraStates[prevIdx]
      const particleSpeed = (state as { subdued?: boolean }).subdued ? 0.01 : 0.05
      const particleOpacity = (state as { subdued?: boolean }).subdued ? 0.001 : 0.06

      // Animate edge particles
      edgeDataList.forEach((data) => {
        data.progress = (data.progress + delta * particleSpeed) % 1
        data.particle.position.lerpVectors(data.a, data.b, data.progress)
        ;(data.particle.material as THREE.MeshBasicMaterial).opacity =
          particleOpacity
      })

      // Smooth opacity transition
      currentOpacity += (targetOpacity - currentOpacity) * 0.05
      if (containerRef.current) {
        containerRef.current.style.opacity = String(currentOpacity)
      }

      composer.render()
    }

    animate()

    // Resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()
      renderer.setSize(window.innerWidth, window.innerHeight)
      composer.setSize(window.innerWidth, window.innerHeight)
    }
    window.addEventListener("resize", handleResize)

    // Cleanup
    cleanupRef.current = () => {
      cancelAnimationFrame(animationId)
      window.removeEventListener("scroll", handleScroll)
      window.removeEventListener("resize", handleResize)
      renderer.dispose()
      composer.dispose()
      scene.clear()
      if (containerRef.current) {
        containerRef.current.innerHTML = ""
      }
    }
  }, [])

  useEffect(() => {
    initScene()
    return () => {
      if (cleanupRef.current) cleanupRef.current()
    }
  }, [initScene])

  return (
    <div
      ref={containerRef}
      className="pointer-events-none fixed inset-0 z-0"
      style={{ transition: "opacity 0.3s ease-out" }}
      aria-hidden="true"
    />
  )
}
