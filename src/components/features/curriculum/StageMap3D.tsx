'use client';

import { useEffect, useRef, useCallback } from 'react';
import {
  Engine,
  Scene,
  ArcRotateCamera,
  HemisphericLight,
  DirectionalLight,
  PointLight,
  MeshBuilder,
  StandardMaterial,
  Color3,
  Color4,
  Vector3,
  GlowLayer,
  DefaultRenderingPipeline,
  ShadowGenerator,
  ActionManager,
  ExecuteCodeAction,
} from '@babylonjs/core';
import type { StageWithStatus } from '@/lib/curriculum/types';

const FLOOR_HEIGHT = 3.5;
const FLOOR_WIDTH_BASE = 5.0;
const FLOOR_WIDTH_TAPER = 0.3;

function floorWidth(stageNumber: number) {
  return FLOOR_WIDTH_BASE - (stageNumber - 1) * FLOOR_WIDTH_TAPER;
}

function floorY(stageNumber: number) {
  return (stageNumber - 1) * FLOOR_HEIGHT;
}

function stageColor(status: StageWithStatus['status']): Color3 {
  switch (status) {
    case 'completed':
      return new Color3(0.7, 0.45, 0.05);
    case 'in_progress':
      return new Color3(0.1, 0.3, 0.85);
    case 'unlocked':
      return new Color3(0.02, 0.37, 0.27);
    case 'locked':
      return new Color3(0.22, 0.25, 0.3);
  }
}

function createStageScene(
  canvas: HTMLCanvasElement,
  stages: StageWithStatus[],
  onStageClick: (stage: StageWithStatus) => void
): { engine: Engine; scene: Scene } {
  const engine = new Engine(canvas, true, { antialias: true, stencil: true });
  const scene = new Scene(engine);
  scene.clearColor = new Color4(0.04, 0.04, 0.1, 1);
  scene.fogMode = Scene.FOGMODE_EXP2;
  scene.fogDensity = 0.015;
  scene.fogColor = new Color3(0.04, 0.04, 0.1);

  const totalHeight = Math.max((stages.length - 1) * FLOOR_HEIGHT, 0);

  // カメラ
  const camera = new ArcRotateCamera(
    'camera',
    -Math.PI / 3,
    Math.PI / 3,
    20,
    new Vector3(0, totalHeight * 0.4, 0),
    scene
  );
  camera.lowerRadiusLimit = 10;
  camera.upperRadiusLimit = 50;
  camera.lowerBetaLimit = 0.2;
  camera.upperBetaLimit = Math.PI / 2.1;
  camera.attachControl(canvas, true);
  camera.useAutoRotationBehavior = true;
  if (camera.autoRotationBehavior) {
    camera.autoRotationBehavior.idleRotationSpeed = 0.08;
  }

  // ライト
  const hemi = new HemisphericLight('hemi', new Vector3(0, 1, 0), scene);
  hemi.intensity = 0.5;
  hemi.diffuse = new Color3(0.8, 0.8, 1);

  const dirLight = new DirectionalLight('dir', new Vector3(-1, -2, -1), scene);
  dirLight.intensity = 1.2;
  dirLight.diffuse = new Color3(1, 0.9, 0.7);
  dirLight.position = new Vector3(10, totalHeight + 10, 10);

  const shadowGen = new ShadowGenerator(1024, dirLight);
  shadowGen.useBlurExponentialShadowMap = true;

  // 基礎
  const base = MeshBuilder.CreateCylinder(
    'base',
    {
      diameterTop: FLOOR_WIDTH_BASE * 1.5,
      diameterBottom: FLOOR_WIDTH_BASE * 1.8,
      height: 2,
      tessellation: 8,
    },
    scene
  );
  base.position.y = -1;
  const baseMat = new StandardMaterial('baseMat', scene);
  baseMat.diffuseColor = new Color3(0.15, 0.14, 0.13);
  base.material = baseMat;
  base.receiveShadows = true;

  // 各フロア
  stages.forEach((stage) => {
    const w = floorWidth(stage.stage_number);
    const y = floorY(stage.stage_number);
    const color = stageColor(stage.status);
    const isLocked = stage.status === 'locked';

    // 壁
    const wall = MeshBuilder.CreateBox(
      `wall${stage.id}`,
      {
        width: w,
        height: FLOOR_HEIGHT,
        depth: w,
      },
      scene
    );
    wall.position = new Vector3(0, y + FLOOR_HEIGHT / 2, 0);
    const wallMat = new StandardMaterial(`wallMat${stage.id}`, scene);
    wallMat.diffuseColor = color;
    wallMat.specularColor = new Color3(0.15, 0.15, 0.15);
    wallMat.alpha = isLocked ? 0.5 : 1;
    wall.material = wallMat;
    shadowGen.addShadowCaster(wall);
    wall.receiveShadows = true;

    // 床
    const floor = MeshBuilder.CreateBox(
      `floor${stage.id}`,
      {
        width: w + 0.5,
        height: 0.3,
        depth: w + 0.5,
      },
      scene
    );
    floor.position = new Vector3(0, y, 0);
    const floorMat = new StandardMaterial(`floorMat${stage.id}`, scene);
    floorMat.diffuseColor = new Color3(0.25, 0.24, 0.22);
    floor.material = floorMat;

    // 四隅の塔
    const halfW = w / 2;
    const corners = [
      new Vector3(-halfW, y, -halfW),
      new Vector3(halfW, y, -halfW),
      new Vector3(-halfW, y, halfW),
      new Vector3(halfW, y, halfW),
    ];
    corners.forEach((pos, ci) => {
      const tower = MeshBuilder.CreateCylinder(
        `tower${stage.id}_${ci}`,
        {
          diameterTop: 0.4,
          diameterBottom: 0.5,
          height: FLOOR_HEIGHT + 1,
          tessellation: 8,
        },
        scene
      );
      tower.position = new Vector3(pos.x, y + (FLOOR_HEIGHT + 1) / 2, pos.z);
      const tMat = new StandardMaterial(`tMat${stage.id}_${ci}`, scene);
      tMat.diffuseColor = color.scale(0.8);
      tMat.alpha = isLocked ? 0.5 : 1;
      tower.material = tMat;
      shadowGen.addShadowCaster(tower);

      // 屋根
      const tRoof = MeshBuilder.CreateCylinder(
        `tRoof${stage.id}_${ci}`,
        {
          diameterTop: 0,
          diameterBottom: 0.7,
          height: 1,
          tessellation: 8,
        },
        scene
      );
      tRoof.position = new Vector3(pos.x, y + FLOOR_HEIGHT + 1, pos.z);
      const trMat = new StandardMaterial(`trMat${stage.id}_${ci}`, scene);
      trMat.diffuseColor = new Color3(0.5, 0.12, 0.08);
      trMat.alpha = isLocked ? 0.5 : 1;
      tRoof.material = trMat;
    });

    // 窓の光
    if (!isLocked) {
      const windowLight = new PointLight(
        `wLight${stage.id}`,
        new Vector3(0, y + FLOOR_HEIGHT * 0.5, 0),
        scene
      );
      windowLight.intensity = 0.4;
      windowLight.diffuse = color.scale(1.5);
      windowLight.range = w * 2;
    }

    // クリックイベント
    if (!isLocked) {
      wall.actionManager = new ActionManager(scene);
      wall.actionManager.registerAction(
        new ExecuteCodeAction(ActionManager.OnPickTrigger, () => {
          onStageClick(stage);
        })
      );
    }
  });

  // 最上部の尖塔
  if (stages.length > 0) {
    const topY = floorY(stages.length) + FLOOR_HEIGHT;
    const spire = MeshBuilder.CreateCylinder(
      'spire',
      {
        diameterTop: 0,
        diameterBottom: 1.5,
        height: 4,
        tessellation: 8,
      },
      scene
    );
    spire.position = new Vector3(0, topY + 2, 0);
    const spireMat = new StandardMaterial('spireMat', scene);
    spireMat.diffuseColor = new Color3(0.5, 0.12, 0.08);
    spire.material = spireMat;

    const topBeacon = MeshBuilder.CreateSphere(
      'topBeacon',
      { diameter: 0.5 },
      scene
    );
    topBeacon.position = new Vector3(0, topY + 4.5, 0);
    const topBeaconMat = new StandardMaterial('topBeaconMat', scene);
    topBeaconMat.emissiveColor = new Color3(1, 0.75, 0.2);
    topBeacon.material = topBeaconMat;

    const topLight = new PointLight(
      'topLight',
      new Vector3(0, topY + 4.5, 0),
      scene
    );
    topLight.intensity = 1.5;
    topLight.diffuse = new Color3(1, 0.85, 0.3);
    topLight.range = 10;
  }

  // ポストプロセス
  const glow = new GlowLayer('glow', scene);
  glow.intensity = 0.5;

  const pipeline = new DefaultRenderingPipeline('pipeline', true, scene, [
    camera,
  ]);
  pipeline.bloomEnabled = true;
  pipeline.bloomThreshold = 0.5;
  pipeline.bloomWeight = 0.3;

  return { engine, scene };
}

export function StageMap3D({
  stages,
  onStageClick,
}: {
  stages: StageWithStatus[];
  onStageClick: (stage: StageWithStatus) => void;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<Engine | null>(null);
  const onStageClickRef = useRef(onStageClick);
  onStageClickRef.current = onStageClick;

  const stableOnStageClick = useCallback((stage: StageWithStatus) => {
    onStageClickRef.current(stage);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const { engine, scene } = createStageScene(
      canvas,
      stages,
      stableOnStageClick
    );
    engineRef.current = engine;

    engine.runRenderLoop(() => scene.render());

    const handleResize = () => engine.resize();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      engine.dispose();
    };
  }, [stages, stableOnStageClick]);

  return (
    <div className="relative h-[680px] w-full overflow-hidden rounded-2xl shadow-2xl">
      <canvas
        ref={canvasRef}
        className="h-full w-full"
        style={{ outline: 'none' }}
      />
      <div className="pointer-events-none absolute bottom-3 right-3 flex flex-col items-end gap-1">
        <span className="rounded-full bg-black/50 px-2.5 py-1 text-xs text-white/70 backdrop-blur-sm">
          ドラッグ: 回転
        </span>
        <span className="rounded-full bg-black/50 px-2.5 py-1 text-xs text-white/70 backdrop-blur-sm">
          スクロール: ズーム
        </span>
      </div>
      <div className="pointer-events-none absolute left-1/2 top-3 -translate-x-1/2">
        <span className="rounded-full border border-amber-500/30 bg-black/40 px-4 py-1 text-xs font-medium text-amber-300/80 backdrop-blur-sm">
          クリックしてステージへ
        </span>
      </div>
    </div>
  );
}
