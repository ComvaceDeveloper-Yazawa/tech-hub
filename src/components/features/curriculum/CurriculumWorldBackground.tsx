'use client';

import { useEffect, useRef } from 'react';
import {
  Engine,
  Scene,
  ArcRotateCamera,
  HemisphericLight,
  DirectionalLight,
  Color3,
  Color4,
  Vector3,
  SceneLoader,
} from '@babylonjs/core';
import '@babylonjs/loaders/glTF';

function createScene(canvas: HTMLCanvasElement): {
  engine: Engine;
  scene: Scene;
} {
  const engine = new Engine(canvas, true, { antialias: true, stencil: true });
  const scene = new Scene(engine);
  scene.clearColor = new Color4(0.15, 0.2, 0.3, 1);

  // カメラ（仮の位置、モデル読み込み後に調整）
  const camera = new ArcRotateCamera(
    'camera',
    -Math.PI / 2,
    Math.PI / 3,
    50,
    Vector3.Zero(),
    scene
  );
  camera.attachControl(canvas, true);
  camera.lowerRadiusLimit = 5;
  camera.upperRadiusLimit = 200;

  // ライト
  const hemi = new HemisphericLight('hemi', new Vector3(0, 1, 0), scene);
  hemi.intensity = 0.8;

  const dir = new DirectionalLight('dir', new Vector3(-0.5, -1, -0.5), scene);
  dir.intensity = 1.2;
  dir.diffuse = new Color3(1, 0.9, 0.7);

  // 城モデル読み込み
  SceneLoader.ImportMesh(
    '',
    '/models/',
    'castle.glb',
    scene,
    (meshes) => {
      console.log('Castle loaded, meshes:', meshes.length);

      // バウンディングボックスからモデルの中心とサイズを計算
      let minX = Infinity,
        minY = Infinity,
        minZ = Infinity;
      let maxX = -Infinity,
        maxY = -Infinity,
        maxZ = -Infinity;

      meshes.forEach((mesh) => {
        mesh.refreshBoundingInfo({});
        const bi = mesh.getBoundingInfo();
        if (!bi) return;
        const bMin = bi.boundingBox.minimumWorld;
        const bMax = bi.boundingBox.maximumWorld;
        minX = Math.min(minX, bMin.x);
        minY = Math.min(minY, bMin.y);
        minZ = Math.min(minZ, bMin.z);
        maxX = Math.max(maxX, bMax.x);
        maxY = Math.max(maxY, bMax.y);
        maxZ = Math.max(maxZ, bMax.z);
      });

      const center = new Vector3(
        (minX + maxX) / 2,
        (minY + maxY) / 2,
        (minZ + maxZ) / 2
      );
      const sizeX = maxX - minX;
      const sizeY = maxY - minY;
      const sizeZ = maxZ - minZ;
      const maxDim = Math.max(sizeX, sizeY, sizeZ);

      console.log(
        'Center:',
        center.toString(),
        'Size:',
        sizeX,
        sizeY,
        sizeZ,
        'MaxDim:',
        maxDim
      );

      // カメラをモデルに合わせる
      camera.target = center;
      camera.radius = maxDim * 1.5;
      camera.alpha = -Math.PI / 2.5;
      camera.beta = Math.PI / 3.5;
    },
    null,
    (_scene, message) => {
      console.error('Castle load error:', message);
    }
  );

  return { engine, scene };
}

export function CurriculumWorldBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const { engine, scene } = createScene(canvas);

    engine.runRenderLoop(() => scene.render());

    const handleResize = () => engine.resize();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      engine.dispose();
    };
  }, []);

  return (
    <div className="absolute inset-0">
      <canvas
        ref={canvasRef}
        className="h-full w-full"
        style={{ outline: 'none' }}
      />
    </div>
  );
}
