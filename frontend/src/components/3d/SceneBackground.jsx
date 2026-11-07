import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';
import { useScreenRatio } from '../../hooks/useScreenRatio';

// Interactive floating particle field
const ParticleStars = ({ isMobile }) => {
  const ref = useRef();
  
  // Mobile gets fewer particles for optimal 60fps battery saving, desktop gets denser starfield
  const particleCount = isMobile ? 1200 : 3500;

  const [positions, colors] = useMemo(() => {
    const pos = new Float32Array(particleCount * 3);
    const col = new Float32Array(particleCount * 3);
    const colorPalette = [
      new THREE.Color('#6366f1'), // Indigo
      new THREE.Color('#06b6d4'), // Cyan
      new THREE.Color('#8b5cf6'), // Purple
      new THREE.Color('#ffffff')  // Pure white sparkle
    ];

    for (let i = 0; i < particleCount; i++) {
      // Spherical distribution
      const r = 25 * Math.cbrt(Math.random());
      const theta = Math.random() * 2 * Math.PI;
      const phi = Math.acos(2 * Math.random() - 1);

      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = r * Math.cos(phi);

      const color = colorPalette[Math.floor(Math.random() * colorPalette.length)];
      col[i * 3] = color.r;
      col[i * 3 + 1] = color.g;
      col[i * 3 + 2] = color.b;
    }
    return [pos, col];
  }, [particleCount]);

  useFrame((state, delta) => {
    if (ref.current) {
      ref.current.rotation.x -= delta * 0.03;
      ref.current.rotation.y -= delta * 0.04;
    }
  });

  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <Points ref={ref} positions={positions} colors={colors} stride={3} frustumCulled={false}>
        <PointMaterial
          transparent
          vertexColors
          size={isMobile ? 0.05 : 0.045}
          sizeAttenuation={true}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </Points>
    </group>
  );
};

// Subtle background floating geometry
const FloatingGeometry = () => {
  const meshRef = useRef();

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (meshRef.current) {
      meshRef.current.rotation.x = Math.sin(t * 0.2) * 0.5;
      meshRef.current.rotation.y = Math.cos(t * 0.25) * 0.5;
      meshRef.current.position.y = Math.sin(t * 0.4) * 0.5;
    }
  });

  return (
    <group ref={meshRef} position={[0, -2, -10]}>
      <mesh scale={[3, 3, 3]}>
        <octahedronGeometry args={[2, 2]} />
        <meshStandardMaterial
          color="#4338ca"
          wireframe
          transparent
          opacity={0.12}
        />
      </mesh>
    </group>
  );
};

export const SceneBackground = () => {
  const { isMobile } = useScreenRatio();

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden bg-[#07080d]">
      {/* Subtle radial ambient gradients */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-indigo-600/15 rounded-full blur-[140px]" />
      <div className="absolute top-1/2 -right-40 w-96 h-96 bg-cyan-600/12 rounded-full blur-[140px]" />
      <div className="absolute -bottom-40 left-1/3 w-96 h-96 bg-purple-600/12 rounded-full blur-[150px]" />

      <Canvas
        camera={{ position: [0, 0, 15], fov: 60 }}
        dpr={isMobile ? [1, 1.5] : [1, 2]}
        gl={{ antialias: false, powerPreference: 'high-performance' }}
      >
        <ambientLight intensity={0.5} />
        <ParticleStars isMobile={isMobile} />
        <FloatingGeometry />
      </Canvas>
    </div>
  );
};
