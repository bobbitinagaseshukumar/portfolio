import React, { useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Float, MeshDistortMaterial, Sphere } from '@react-three/drei';
import * as THREE from 'three';
import { useScreenRatio } from '../../hooks/useScreenRatio';

// Adaptive camera updater inside Canvas context
const AdaptiveCamera = ({ cameraFov, cameraDistance }) => {
  const { camera } = useThree();

  useFrame(() => {
    if (camera.fov !== cameraFov) {
      camera.fov = THREE.MathUtils.lerp(camera.fov, cameraFov, 0.08);
      camera.updateProjectionMatrix();
    }
    if (camera.position.z !== cameraDistance) {
      camera.position.z = THREE.MathUtils.lerp(camera.position.z, cameraDistance, 0.08);
    }
  });

  return null;
};

// 3D Cyber Core with Orbital Rings
const CyberCore = ({ meshScale }) => {
  const outerRingRef = useRef();
  const innerRingRef = useRef();
  const coreRef = useRef();
  const particlesGroupRef = useRef();

  useFrame((state, delta) => {
    const t = state.clock.getElapsedTime();

    // Orbital ring rotations
    if (outerRingRef.current) {
      outerRingRef.current.rotation.x = t * 0.45;
      outerRingRef.current.rotation.y = t * 0.35;
    }
    if (innerRingRef.current) {
      innerRingRef.current.rotation.y = -t * 0.55;
      innerRingRef.current.rotation.z = t * 0.4;
    }

    // Interactive mouse parallax on core
    if (coreRef.current) {
      const mouseX = state.pointer.x * 0.4;
      const mouseY = state.pointer.y * 0.4;
      coreRef.current.rotation.y = THREE.MathUtils.lerp(coreRef.current.rotation.y, mouseX + t * 0.2, 0.05);
      coreRef.current.rotation.x = THREE.MathUtils.lerp(coreRef.current.rotation.x, -mouseY, 0.05);
    }

    if (particlesGroupRef.current) {
      particlesGroupRef.current.rotation.y = t * 0.15;
    }
  });

  return (
    <group scale={[meshScale, meshScale, meshScale]}>
      {/* Gentle Floating Motion */}
      <Float speed={2.5} rotationIntensity={0.6} floatIntensity={1.2}>
        <group ref={coreRef}>
          {/* Inner Distorted Energy Sphere */}
          <Sphere args={[1.1, 64, 64]}>
            <MeshDistortMaterial
              color="#6366f1"
              emissive="#312e81"
              emissiveIntensity={0.6}
              roughness={0.2}
              metalness={0.8}
              distort={0.35}
              speed={2.2}
            />
          </Sphere>

          {/* Hologram Wireframe Outer Shell */}
          <mesh scale={[1.45, 1.45, 1.45]}>
            <icosahedronGeometry args={[1, 2]} />
            <meshStandardMaterial
              color="#06b6d4"
              wireframe
              transparent
              opacity={0.35}
              emissive="#06b6d4"
              emissiveIntensity={0.3}
            />
          </mesh>

          {/* Outer Orbital Ring 1 */}
          <group ref={outerRingRef}>
            <mesh>
              <torusGeometry args={[2.0, 0.035, 16, 100]} />
              <meshStandardMaterial
                color="#818cf8"
                emissive="#6366f1"
                emissiveIntensity={0.8}
                metalness={0.9}
                roughness={0.1}
              />
            </mesh>
            {/* Satellite Node on Ring */}
            <mesh position={[2.0, 0, 0]}>
              <sphereGeometry args={[0.09, 16, 16]} />
              <meshStandardMaterial color="#38bdf8" emissive="#38bdf8" emissiveIntensity={1.5} />
            </mesh>
          </group>

          {/* Inner Orbital Ring 2 */}
          <group ref={innerRingRef}>
            <mesh>
              <torusGeometry args={[1.7, 0.025, 16, 100]} />
              <meshStandardMaterial
                color="#22d3ee"
                emissive="#06b6d4"
                emissiveIntensity={0.9}
                metalness={0.9}
                roughness={0.1}
              />
            </mesh>
            <mesh position={[0, 1.7, 0]}>
              <sphereGeometry args={[0.07, 16, 16]} />
              <meshStandardMaterial color="#a855f7" emissive="#a855f7" emissiveIntensity={1.5} />
            </mesh>
          </group>
        </group>
      </Float>
    </group>
  );
};

export const Hero3DCanvas = () => {
  const { cameraFov, cameraDistance, meshScale, isMobile } = useScreenRatio();

  return (
    <div className="w-full h-full min-h-[340px] sm:min-h-[420px] md:min-h-[500px] lg:min-h-[580px] relative flex items-center justify-center">
      <Canvas
        camera={{ position: [0, 0, cameraDistance], fov: cameraFov }}
        dpr={isMobile ? [1, 1.5] : [1, 2]}
        gl={{ antialias: true, alpha: true }}
      >
        <AdaptiveCamera cameraFov={cameraFov} cameraDistance={cameraDistance} />
        
        {/* Cinematic 3D Lighting */}
        <ambientLight intensity={0.7} />
        <pointLight position={[10, 10, 10]} intensity={1.5} color="#818cf8" />
        <pointLight position={[-10, -10, -10]} intensity={1.2} color="#06b6d4" />
        <pointLight position={[0, 5, 2]} intensity={1.8} color="#ffffff" />

        <CyberCore meshScale={meshScale} />
      </Canvas>
    </div>
  );
};
