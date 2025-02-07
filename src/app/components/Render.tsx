"use client"
import { Canvas } from '@react-three/fiber'
import { Suspense, useEffect, useRef } from 'react'
import gsap from 'gsap'
import * as THREE from 'three'
import { useGLTF } from '@react-three/drei'
import { useStore } from '@/useStore'

function Model({ url }: { url: string }) {
  const { scene } = useGLTF(url)
  const meshRef = useRef()

  scene.traverse((child) => {
    if (child.isMesh) {
      child.scale.set(50, 50, 50)
      child.material = new THREE.MeshBasicMaterial({
        colorWrite: false,
        stencilWrite: true,
        stencilFunc: THREE.AlwaysStencilFunc,
        stencilRef: 1,
        stencilZPass: THREE.ReplaceStencilOp,
        depthWrite: false,
        depthTest: false
      })
    }
  })

  useEffect(() => {
    if (meshRef.current) {
      meshRef.current.rotation.y = Math.PI / 2
      // meshRef.current.scale.set(15, 15, 15)

      gsap.to(meshRef.current.scale, {
        x: 0.8, y: 0.8, z: 0.8,
        duration: 0.7, ease: 'power4.out',
      })
      gsap.to(meshRef.current.rotation, {
        y: '+=6.28', // Full rotation (360 degrees)
        delay: 0.15, duration: 3, ease: 'power4.out',
      })
      gsap.to(meshRef.current.scale, {
        x: 20, y: 20, z: 20,
        duration: 0.7, delay: 1.6, ease: 'power4.in',
      })
    }
  }, [])

  return <primitive ref={meshRef} object={scene} />
}

function Model2({ url }: { url: string }) {
  const { scene } = useGLTF(url)
  const meshRef = useRef()

  scene.traverse((child) => {
    if (child.isMesh) {
      child.scale.set(50, 50, 50)
      child.material = new THREE.MeshPhysicalMaterial({
        opacity: 0.5, roughness: 0.15, metalness: 0,
        thickness: 0.005, transmission: 1, ior: 100, transparent: true,
      })
    }
  })

  useEffect(() => {
    if (meshRef.current) {
      meshRef.current.rotation.y = Math.PI / 2
      // meshRef.current.scale.set(15, 15, 15)

      gsap.to(meshRef.current.scale, {
        x: 0.8, y: 0.9, z: 0.8,
        duration: 0.7, ease: 'power4.out',
      })
      gsap.to(meshRef.current.rotation, {
        y: '+=6.28', // Full rotation (360 degrees)
        delay: 0.15, duration: 3, ease: 'power4.out',
      })
      gsap.to(meshRef.current.scale, {
        x: 20, y: 20, z: 20,
        duration: 0.7, delay: 1.6, ease: 'power4.in',
      })
    }
  }, [])

  return <primitive ref={meshRef} object={scene} />
}

function Scene1() {
  return (
    <>
      <Suspense fallback={null}>
        <Model url="/model.gltf" />
        <directionalLight intensity={10} position={[1, 2, 0]} />
      </Suspense>

      {/* Plane Mesh for Stencil Effect */}
      <mesh scale={[50, 50, 1]} renderOrder={1}>
        <planeGeometry />
        <meshBasicMaterial
          color="black"
          stencilWrite={true}
          stencilFunc={THREE.NotEqualStencilFunc}
          stencilRef={1}
          depthWrite={false}
          depthTest={false}
        />
      </mesh>
    </>
  )
}

function Scene2() {
  return (
    <>
      <Suspense fallback={null}>
        <Model2 url="/model2.gltf" />
        <directionalLight intensity={10} position={[1, 2, 0]} />
      </Suspense>
    </>
  )
}

export default function Render() {
  const { pageTransition } = useStore()
  const canvasRef1 = useRef<HTMLDivElement>(null)
  const canvasRef2 = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setTimeout(() => {
      if (canvasRef1.current) {
        gsap.to(canvasRef1.current, { opacity: 1, duration: 0.1 })
        gsap.to(canvasRef1.current, { opacity: 0, duration: 0.1, delay: 2.35 })
      }
      if (canvasRef2.current) {
        gsap.to(canvasRef2.current, { opacity: 1, duration: 0.1,delay: 0.5})
        gsap.to(canvasRef2.current, { opacity: 0, duration: 0.3, delay: 1.5 }) // Different opacity
      }
    }, 0) // Small delay to ensure DOM is updated
  }, [pageTransition])

  if (!pageTransition) return null

  return (
    <>
      {/* First Layer - Model */}
      <div ref={canvasRef1} style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100%', zIndex: 10, opacity: 1, pointerEvents: 'none' }}>
        <Canvas orthographic camera={{ position: [0, 0, 20], zoom: 100, near: 0.1, far: 1000 }} gl={{ alpha: true, stencil: true, antialias: true }} style={{ position: 'fixed', width: '100%', height: '100%', zIndex: 1, background: 'transparent' }}>
          <Scene1 />
        </Canvas>
      </div>

      {/* Second Layer - Model2 */}
      <div ref={canvasRef2} style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100%', zIndex: 9, opacity: 0, pointerEvents: 'none' }}> z
        <Canvas orthographic camera={{ position: [0, 0, 20], zoom: 100, near: 0.1, far: 1000 }} gl={{ alpha: true, stencil: true, antialias: true }} style={{ position: 'fixed', width: '100%', height: '100%', zIndex: 1, background: 'transparent' }}>
          <Scene2 />
        </Canvas>
      </div>
    </>
  )
}
