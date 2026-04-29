'use client';

import { Suspense, useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import {
  useGLTF,
  OrbitControls,
  Cloud,
  Float,
  Stars,
  Environment,
} from '@react-three/drei';
import * as THREE from 'three';

// 城モデル
function CastleModel() {
  const { scene } = useGLTF('/models/castle.glb');
  const cloned = useMemo(() => scene.clone(), [scene]);
  return (
    <primitive
      object={cloned}
      position={[0, -5, -15]}
      scale={[0.03, 0.03, 0.03]}
      rotation={[0, Math.PI * 0.15, 0]}
    />
  );
}

// 空のグラデーション（BotW風夕暮れ）
function SkyGradient() {
  const mat = useMemo(() => {
    return new THREE.ShaderMaterial({
      side: THREE.BackSide,
      uniforms: {},
      vertexShader: `
        varying vec3 vWorldPosition;
        void main() {
          vec4 worldPos = modelMatrix * vec4(position, 1.0);
          vWorldPosition = worldPos.xyz;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        varying vec3 vWorldPosition;
        void main() {
          float h = normalize(vWorldPosition).y;
          vec3 horizon = vec3(0.95, 0.55, 0.25);
          vec3 mid = vec3(0.98, 0.82, 0.45);
          vec3 sky = vec3(0.35, 0.55, 0.78);
          vec3 top = vec3(0.15, 0.25, 0.55);
          vec3 col;
          if (h < 0.0) {
            col = horizon;
          } else if (h < 0.15) {
            col = mix(horizon, mid, h / 0.15);
          } else if (h < 0.4) {
            col = mix(mid, sky, (h - 0.15) / 0.25);
          } else {
            col = mix(sky, top, clamp((h - 0.4) / 0.4, 0.0, 1.0));
          }
          gl_FragColor = vec4(col, 1.0);
        }
      `,
    });
  }, []);

  return (
    <mesh material={mat}>
      <sphereGeometry args={[90, 32, 32]} />
    </mesh>
  );
}

// 太陽
function Sun() {
  return (
    <group position={[0, 3, -50]}>
      <mesh>
        <sphereGeometry args={[4, 32, 32]} />
        <meshBasicMaterial color="#fff8e1" transparent opacity={0.9} />
      </mesh>
      <mesh>
        <sphereGeometry args={[8, 32, 32]} />
        <meshBasicMaterial color="#ffe082" transparent opacity={0.15} />
      </mesh>
      <mesh>
        <sphereGeometry args={[15, 32, 32]} />
        <meshBasicMaterial color="#ffcc80" transparent opacity={0.06} />
      </mesh>
      <pointLight color="#fef3c7" intensity={4} distance={80} />
    </group>
  );
}

// 浮遊する光の粒子
function FloatingParticles() {
  const count = 60;
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 40;
      arr[i * 3 + 1] = Math.random() * 12 - 2;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 20 - 5;
    }
    return arr;
  }, []);

  const geoRef = useRef<THREE.BufferGeometry>(null);
  useFrame(({ clock }) => {
    if (!geoRef.current) return;
    const pos = geoRef.current.attributes.position;
    if (!pos) return;
    for (let i = 0; i < count; i++) {
      const y = pos.getY(i);
      pos.setY(i, y + Math.sin(clock.getElapsedTime() * 0.3 + i) * 0.003);
    }
    pos.needsUpdate = true;
  });

  return (
    <points>
      <bufferGeometry ref={geoRef}>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        color="#fde68a"
        size={0.08}
        transparent
        opacity={0.7}
        sizeAttenuation
      />
    </points>
  );
}

// 鳥
function Birds() {
  const groupRef = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    if (groupRef.current) {
      groupRef.current.position.x =
        Math.sin(clock.getElapsedTime() * 0.15) * 15;
      groupRef.current.position.y =
        8 + Math.sin(clock.getElapsedTime() * 0.3) * 0.5;
    }
  });

  return (
    <group ref={groupRef} position={[5, 8, -20]}>
      {[0, 1, 2].map((i) => (
        <mesh key={i} position={[i * 1.2, i * 0.3, i * 0.5]}>
          <boxGeometry args={[0.4, 0.02, 0.15]} />
          <meshBasicMaterial color="#2a2a2a" />
        </mesh>
      ))}
    </group>
  );
}

// ローディング表示
function LoadingFallback() {
  return (
    <Float speed={2} floatIntensity={0.5}>
      <mesh>
        <sphereGeometry args={[0.3, 16, 16]} />
        <meshBasicMaterial color="#fbbf24" />
      </mesh>
    </Float>
  );
}

export function CurriculumWorldBackground() {
  return (
    <div className="absolute inset-0">
      <Canvas
        camera={{ position: [0, 5, 20], fov: 50, near: 0.1, far: 200 }}
        gl={{
          antialias: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.1,
        }}
      >
        <SkyGradient />
        <fog attach="fog" args={['#c8956a', 30, 80]} />
        <ambientLight intensity={0.5} color="#ffe4c4" />
        <directionalLight
          position={[5, 15, -10]}
          intensity={2}
          color="#fef3c7"
          castShadow
        />
        <hemisphereLight
          color="#87ceeb"
          groundColor="#3a5a2a"
          intensity={0.4}
        />

        <Sun />
        <Stars
          radius={60}
          depth={40}
          count={1500}
          factor={3}
          saturation={0.3}
          fade
          speed={0.3}
        />
        <Cloud position={[-15, 6, -25]} speed={0.08} opacity={0.2} />
        <Cloud position={[12, 8, -30]} speed={0.06} opacity={0.15} />
        <Cloud position={[0, 4, -20]} speed={0.1} opacity={0.12} />

        <Suspense fallback={<LoadingFallback />}>
          <CastleModel />
        </Suspense>

        <FloatingParticles />
        <Birds />

        <OrbitControls
          enablePan={false}
          enableZoom={false}
          enableRotate={true}
          autoRotate={true}
          autoRotateSpeed={0.3}
          minPolarAngle={Math.PI * 0.3}
          maxPolarAngle={Math.PI * 0.6}
        />
      </Canvas>
    </div>
  );
}

// プリロード
useGLTF.preload('/models/castle.glb');
