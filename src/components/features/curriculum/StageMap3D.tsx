'use client';

import { useRef, useState, useMemo, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Text, Float, Stars, Cloud } from '@react-three/drei';
import * as THREE from 'three';
import type { StageWithStatus } from '@/lib/curriculum/types';

const FLOOR_HEIGHT = 3.5;
const FLOOR_WIDTH_BASE = 5.0;
const FLOOR_WIDTH_TAPER = 0.3; // 上に行くほど細くなる

function floorWidth(stageNumber: number) {
  return FLOOR_WIDTH_BASE - (stageNumber - 1) * FLOOR_WIDTH_TAPER;
}

function floorY(stageNumber: number) {
  return (stageNumber - 1) * FLOOR_HEIGHT;
}

function stageColors(status: StageWithStatus['status']) {
  switch (status) {
    case 'completed':
      return {
        wall: '#b45309',
        roof: '#92400e',
        accent: '#fbbf24',
        emissive: '#78350f',
      };
    case 'in_progress':
      return {
        wall: '#1d4ed8',
        roof: '#1e3a8a',
        accent: '#60a5fa',
        emissive: '#1e3a8a',
      };
    case 'unlocked':
      return {
        wall: '#065f46',
        roof: '#064e3b',
        accent: '#34d399',
        emissive: '#064e3b',
      };
    case 'locked':
      return {
        wall: '#374151',
        roof: '#1f2937',
        accent: '#6b7280',
        emissive: '#111827',
      };
  }
}

// 城壁の石ブロックテクスチャ風マテリアル
function StoneMaterial({
  color,
  emissive,
  opacity = 1,
}: {
  color: string;
  emissive: string;
  opacity?: number;
}) {
  return (
    <meshStandardMaterial
      color={color}
      emissive={emissive}
      emissiveIntensity={0.15}
      roughness={0.85}
      metalness={0.1}
      opacity={opacity}
      transparent={opacity < 1}
    />
  );
}

// 城の旗
function CastleFlag({ color, height }: { color: string; height: number }) {
  const flagRef = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    if (flagRef.current) {
      flagRef.current.rotation.y = Math.sin(clock.getElapsedTime() * 1.5) * 0.3;
    }
  });
  return (
    <group position={[0, height, 0]}>
      {/* 旗竿 */}
      <mesh>
        <cylinderGeometry args={[0.04, 0.04, 1.5, 8]} />
        <meshStandardMaterial color="#d4a017" metalness={0.8} roughness={0.2} />
      </mesh>
      {/* 旗 */}
      <mesh ref={flagRef} position={[0.3, 0.5, 0]}>
        <boxGeometry args={[0.6, 0.35, 0.02]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.3}
        />
      </mesh>
    </group>
  );
}

// 城の窓
function CastleWindow({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh>
        <boxGeometry args={[0.25, 0.4, 0.05]} />
        <meshStandardMaterial
          color="#1e1b4b"
          emissive="#fbbf24"
          emissiveIntensity={0.6}
        />
      </mesh>
      {/* 窓枠 */}
      <mesh position={[0, 0, 0.03]}>
        <boxGeometry args={[0.32, 0.48, 0.02]} />
        <meshStandardMaterial color="#78716c" roughness={0.9} />
      </mesh>
    </group>
  );
}

// 城の胸壁（上部のギザギザ）
function Battlements({
  width,
  y,
  count = 6,
}: {
  width: number;
  y: number;
  count?: number;
}) {
  const merlons = [];
  for (let i = 0; i < count; i++) {
    const x = -width / 2 + (i + 0.5) * (width / count);
    merlons.push(
      <mesh key={i} position={[x, y + 0.2, 0]}>
        <boxGeometry args={[(width / count) * 0.5, 0.4, 0.3]} />
        <meshStandardMaterial color="#57534e" roughness={0.9} />
      </mesh>
    );
  }
  return <>{merlons}</>;
}

// 塔（四隅）
function CornerTower({
  position,
  height,
  color,
  emissive,
}: {
  position: [number, number, number];
  height: number;
  color: string;
  emissive: string;
}) {
  return (
    <group position={position}>
      {/* 塔本体 */}
      <mesh position={[0, height / 2, 0]}>
        <cylinderGeometry args={[0.45, 0.5, height, 8]} />
        <StoneMaterial color={color} emissive={emissive} />
      </mesh>
      {/* 塔の屋根（円錐） */}
      <mesh position={[0, height + 0.5, 0]}>
        <coneGeometry args={[0.55, 1.0, 8]} />
        <meshStandardMaterial color="#7f1d1d" roughness={0.7} />
      </mesh>
      {/* 塔の窓 */}
      <mesh position={[0, height * 0.6, 0.46]}>
        <boxGeometry args={[0.2, 0.3, 0.05]} />
        <meshStandardMaterial
          color="#1e1b4b"
          emissive="#fbbf24"
          emissiveIntensity={0.5}
        />
      </mesh>
    </group>
  );
}

// 1フロア分の城
function CastleFloor({
  stage,
  isHovered,
  onClick,
  onHover,
}: {
  stage: StageWithStatus;
  isHovered: boolean;
  onClick: () => void;
  onHover: (v: boolean) => void;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const glowRef = useRef<THREE.PointLight>(null);
  const colors = stageColors(stage.status);
  const w = floorWidth(stage.stage_number);
  const y = floorY(stage.stage_number);
  const isLocked = stage.status === 'locked';

  useFrame(({ clock }, delta) => {
    if (!groupRef.current) return;
    // ホバー時に少し浮く
    const targetY = y + (isHovered ? 0.15 : 0);
    groupRef.current.position.y +=
      (targetY - groupRef.current.position.y) * delta * 10;

    // 光の点滅
    if (glowRef.current) {
      glowRef.current.intensity = isLocked
        ? 0
        : 0.6 + Math.sin(clock.getElapsedTime() * 2 + stage.stage_number) * 0.2;
    }
  });

  const halfW = w / 2;

  return (
    <group ref={groupRef} position={[0, y, 0]}>
      {/* 城壁メイン（4面） */}
      {/* 前面 */}
      <mesh
        position={[0, FLOOR_HEIGHT / 2, halfW]}
        onClick={isLocked ? undefined : onClick}
        onPointerEnter={isLocked ? undefined : () => onHover(true)}
        onPointerLeave={() => onHover(false)}
      >
        <boxGeometry args={[w, FLOOR_HEIGHT, 0.4]} />
        <StoneMaterial
          color={colors.wall}
          emissive={colors.emissive}
          opacity={isLocked ? 0.6 : 1}
        />
      </mesh>
      {/* 背面 */}
      <mesh position={[0, FLOOR_HEIGHT / 2, -halfW]}>
        <boxGeometry args={[w, FLOOR_HEIGHT, 0.4]} />
        <StoneMaterial
          color={colors.wall}
          emissive={colors.emissive}
          opacity={isLocked ? 0.6 : 1}
        />
      </mesh>
      {/* 左面 */}
      <mesh position={[-halfW, FLOOR_HEIGHT / 2, 0]}>
        <boxGeometry args={[0.4, FLOOR_HEIGHT, w]} />
        <StoneMaterial
          color={colors.wall}
          emissive={colors.emissive}
          opacity={isLocked ? 0.6 : 1}
        />
      </mesh>
      {/* 右面 */}
      <mesh position={[halfW, FLOOR_HEIGHT / 2, 0]}>
        <boxGeometry args={[0.4, FLOOR_HEIGHT, w]} />
        <StoneMaterial
          color={colors.wall}
          emissive={colors.emissive}
          opacity={isLocked ? 0.6 : 1}
        />
      </mesh>

      {/* 床 */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[w + 0.4, 0.3, w + 0.4]} />
        <meshStandardMaterial color="#44403c" roughness={0.95} />
      </mesh>

      {/* 胸壁（上部ギザギザ） */}
      <Battlements width={w} y={FLOOR_HEIGHT} count={Math.round(w * 1.2)} />

      {/* 四隅の塔 */}
      <CornerTower
        position={[-halfW, 0, -halfW]}
        height={FLOOR_HEIGHT + 0.8}
        color={colors.wall}
        emissive={colors.emissive}
      />
      <CornerTower
        position={[halfW, 0, -halfW]}
        height={FLOOR_HEIGHT + 0.8}
        color={colors.wall}
        emissive={colors.emissive}
      />
      <CornerTower
        position={[-halfW, 0, halfW]}
        height={FLOOR_HEIGHT + 0.8}
        color={colors.wall}
        emissive={colors.emissive}
      />
      <CornerTower
        position={[halfW, 0, halfW]}
        height={FLOOR_HEIGHT + 0.8}
        color={colors.wall}
        emissive={colors.emissive}
      />

      {/* 窓 */}
      {!isLocked && (
        <>
          <CastleWindow position={[0, FLOOR_HEIGHT * 0.55, halfW + 0.01]} />
          <CastleWindow
            position={[-w * 0.3, FLOOR_HEIGHT * 0.55, halfW + 0.01]}
          />
          <CastleWindow
            position={[w * 0.3, FLOOR_HEIGHT * 0.55, halfW + 0.01]}
          />
        </>
      )}

      {/* 旗 */}
      {!isLocked && (
        <CastleFlag color={colors.accent} height={FLOOR_HEIGHT + 1.5} />
      )}

      {/* 内部の光 */}
      <pointLight
        ref={glowRef}
        position={[0, FLOOR_HEIGHT * 0.5, 0]}
        color={colors.accent}
        intensity={0.6}
        distance={w * 2}
      />

      {/* ステージ番号・タイトル（前面に表示） */}
      <Text
        position={[0, FLOOR_HEIGHT * 0.5, halfW + 0.25]}
        fontSize={0.55}
        color={isLocked ? '#6b7280' : '#fef3c7'}
        anchorX="center"
        anchorY="middle"
        fontWeight="bold"
        outlineWidth={0.04}
        outlineColor="#000000"
      >
        {isLocked ? '🔒' : `${stage.stage_number}`}
      </Text>
      <Text
        position={[0, FLOOR_HEIGHT * 0.25, halfW + 0.25]}
        fontSize={0.28}
        color={isLocked ? '#9ca3af' : '#fde68a'}
        anchorX="center"
        anchorY="middle"
        maxWidth={w * 0.9}
        outlineWidth={0.03}
        outlineColor="#000000"
      >
        {stage.title}
      </Text>

      {/* 完了バッジ */}
      {stage.status === 'completed' && (
        <Float speed={1.5} floatIntensity={0.3}>
          <Text
            position={[halfW * 0.7, FLOOR_HEIGHT + 0.5, halfW * 0.7]}
            fontSize={0.5}
            anchorX="center"
            anchorY="middle"
          >
            ⭐
          </Text>
        </Float>
      )}
    </group>
  );
}

// 城の基礎（地面）
function CastleBase({ width }: { width: number }) {
  return (
    <group>
      {/* 石畳の基礎 */}
      <mesh position={[0, -0.5, 0]} receiveShadow>
        <cylinderGeometry args={[width * 0.9, width, 1.0, 8]} />
        <meshStandardMaterial color="#292524" roughness={0.95} />
      </mesh>
      {/* 堀（水） */}
      <mesh position={[0, -0.8, 0]} receiveShadow>
        <cylinderGeometry args={[width * 1.3, width * 1.4, 0.4, 32]} />
        <meshStandardMaterial
          color="#1e3a5f"
          emissive="#1e40af"
          emissiveIntensity={0.3}
          roughness={0.1}
          metalness={0.5}
        />
      </mesh>
      {/* 橋 */}
      <mesh position={[0, -0.6, width * 1.1]} rotation={[0, 0, 0]}>
        <boxGeometry args={[1.5, 0.15, width * 0.5]} />
        <meshStandardMaterial color="#78716c" roughness={0.9} />
      </mesh>
    </group>
  );
}

// 空の雲・星
function SkyEnvironment() {
  return (
    <>
      <Stars
        radius={80}
        depth={50}
        count={3000}
        factor={4}
        saturation={0.5}
        fade
        speed={0.5}
      />
      <Cloud position={[-12, 15, -10]} speed={0.2} opacity={0.15} />
      <Cloud position={[10, 18, -15]} speed={0.15} opacity={0.1} />
    </>
  );
}

function SceneEnvironment() {
  return (
    <>
      <color attach="background" args={['#060b18']} />
      <fog attach="fog" args={['#060b18', 30, 80]} />
      <ambientLight intensity={0.35} color="#c7d2fe" />
      <directionalLight
        position={[15, 25, 10]}
        intensity={1.5}
        color="#fef3c7"
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-far={60}
        shadow-camera-left={-20}
        shadow-camera-right={20}
        shadow-camera-top={20}
        shadow-camera-bottom={-20}
      />
      {/* 月光 */}
      <pointLight position={[-20, 30, -20]} intensity={0.8} color="#e0e7ff" />
      {/* 地面からの反射光 */}
      <pointLight position={[0, -2, 0]} intensity={0.4} color="#1e3a8a" />
    </>
  );
}

function CameraSetup({ stageCount }: { stageCount: number }) {
  const { camera } = useThree();
  useMemo(() => {
    const totalHeight = (stageCount - 1) * FLOOR_HEIGHT;
    camera.position.set(18, totalHeight * 0.4 + 8, 18);
    camera.lookAt(0, totalHeight * 0.3, 0);
  }, [camera, stageCount]);
  return null;
}

function Scene({
  stages,
  onStageClick,
}: {
  stages: StageWithStatus[];
  onStageClick: (stage: StageWithStatus) => void;
}) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const baseWidth = floorWidth(1);

  return (
    <>
      <SceneEnvironment />
      <SkyEnvironment />
      <CameraSetup stageCount={stages.length} />
      <OrbitControls
        enablePan={true}
        enableZoom={true}
        enableRotate={true}
        minDistance={8}
        maxDistance={60}
        minPolarAngle={Math.PI * 0.05}
        maxPolarAngle={Math.PI * 0.7}
        autoRotate={true}
        autoRotateSpeed={0.4}
      />

      {/* 城の基礎 */}
      <CastleBase width={baseWidth} />

      {/* 各フロア */}
      {stages.map((stage) => (
        <CastleFloor
          key={stage.id}
          stage={stage}
          isHovered={hoveredId === stage.id}
          onClick={() => onStageClick(stage)}
          onHover={(v) => setHoveredId(v ? stage.id : null)}
        />
      ))}

      {/* 最上部の尖塔 */}
      {stages.length > 0 && (
        <group position={[0, floorY(stages.length) + FLOOR_HEIGHT, 0]}>
          <mesh position={[0, 1.5, 0]}>
            <coneGeometry args={[1.2, 3.0, 8]} />
            <meshStandardMaterial
              color="#7f1d1d"
              roughness={0.6}
              emissive="#450a0a"
              emissiveIntensity={0.3}
            />
          </mesh>
          <Float speed={2} floatIntensity={0.5}>
            <pointLight
              position={[0, 3.5, 0]}
              color="#fbbf24"
              intensity={2}
              distance={8}
            />
            <mesh position={[0, 3.5, 0]}>
              <sphereGeometry args={[0.2, 16, 16]} />
              <meshStandardMaterial
                color="#fbbf24"
                emissive="#fbbf24"
                emissiveIntensity={3}
              />
            </mesh>
          </Float>
        </group>
      )}
    </>
  );
}

export function StageMap3D({
  stages,
  onStageClick,
}: {
  stages: StageWithStatus[];
  onStageClick: (stage: StageWithStatus) => void;
}) {
  return (
    <div className="relative h-[680px] w-full overflow-hidden rounded-2xl shadow-2xl">
      <Canvas
        shadows
        camera={{ fov: 45, near: 0.1, far: 200 }}
        gl={{
          antialias: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.2,
        }}
      >
        <Scene stages={stages} onStageClick={onStageClick} />
      </Canvas>

      {/* 操作ヒント */}
      <div className="pointer-events-none absolute bottom-3 right-3 flex flex-col items-end gap-1">
        <span className="rounded-full bg-black/50 px-2.5 py-1 text-xs text-white/70 backdrop-blur-sm">
          ドラッグ: 回転
        </span>
        <span className="rounded-full bg-black/50 px-2.5 py-1 text-xs text-white/70 backdrop-blur-sm">
          スクロール: ズーム
        </span>
      </div>

      {/* タイトル装飾 */}
      <div className="pointer-events-none absolute left-1/2 top-3 -translate-x-1/2">
        <span className="rounded-full border border-amber-500/30 bg-black/40 px-4 py-1 text-xs font-medium text-amber-300/80 backdrop-blur-sm">
          ✦ クリックしてステージへ ✦
        </span>
      </div>
    </div>
  );
}
