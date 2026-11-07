import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float } from '@react-three/drei';
import * as THREE from 'three';
import { useAdminTheme } from '../context/AdminThemeContext';

function InteractiveCore({ color }) {
  const meshRef = useRef();
  const innerRef = useRef();

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += delta * 0.4;
      meshRef.current.rotation.y += delta * 0.6;
    }
    if (innerRef.current) {
      innerRef.current.rotation.x -= delta * 0.5;
      innerRef.current.rotation.y += delta * 0.3;
    }
  });

  return (
    <Float speed={3} rotationIntensity={1.5} floatIntensity={1.2}>
      <group>
        {/* Outer Wireframe Torus Knot */}
        <mesh ref={meshRef}>
          <torusKnotGeometry args={[1.1, 0.28, 64, 16]} />
          <meshStandardMaterial
            color={color}
            wireframe
            transparent
            opacity={0.7}
            emissive={color}
            emissiveIntensity={0.4}
          />
        </mesh>
        {/* Inner Glowing Crystal Core */}
        <mesh ref={innerRef}>
          <octahedronGeometry args={[0.65, 0]} />
          <meshStandardMaterial
            color="#ffffff"
            roughness={0.1}
            metalness={0.9}
            emissive={color}
            emissiveIntensity={0.6}
          />
        </mesh>
      </group>
    </Float>
  );
}

export const Admin3DHeroWidget = () => {
  const { theme, threeDEnabled } = useAdminTheme();

  return (
    <div className="relative w-full h-48 sm:h-56 rounded-2xl overflow-hidden bg-gradient-to-br from-[#0c0f1d] via-[#101424] to-[#0a0d18] border border-slate-800/80 shadow-2xl flex items-center justify-between p-6">
      
      {/* Background Holographic Grid Accent */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:2rem_2rem] pointer-events-none" />

      {/* Left Info Overlay */}
      <div className="relative z-10 max-w-sm">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[11px] font-mono mb-2.5">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          WebGL 3D Core • Active
        </div>
        <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight">
          Cinematic Admin Engine
        </h3>
        <p className="text-xs text-slate-400 mt-1 leading-relaxed">
          Interactive real-time 3D telemetry and high-precision boxed section management.
        </p>

        <div className="flex items-center gap-4 mt-3 text-[11px] font-mono text-slate-400">
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
            Theme: <strong className="text-white capitalize">{theme.name}</strong>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            60 FPS Ready
          </span>
        </div>
      </div>

      {/* Right 3D Canvas */}
      <div className="w-48 sm:w-64 h-full relative cursor-grab active:cursor-grabbing">
        {threeDEnabled ? (
          <Canvas
            camera={{ position: [0, 0, 4.2], fov: 45 }}
            gl={{ alpha: true, antialias: true }}
            style={{ width: '100%', height: '100%' }}
          >
            <ambientLight intensity={0.8} />
            <pointLight position={[5, 5, 5]} intensity={2} color={theme.orbColor} />
            <pointLight position={[-5, -5, -5]} intensity={1} color="#38bdf8" />
            <InteractiveCore color={theme.orbColor} />
          </Canvas>
        ) : (
          <div className="w-full h-full flex items-center justify-center text-xs text-slate-500 font-mono">
            3D Engine In Eco Mode
          </div>
        )}
      </div>
    </div>
  );
};
