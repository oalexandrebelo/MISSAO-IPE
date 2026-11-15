import { useEffect, useState } from 'react';
import { useThree } from '@react-three/fiber';
import { Mesh, MeshStandardMaterial } from 'three';
import type { Group } from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { disposeAsset } from './scene-asset.ts';

const PLATFORM_URL = `${import.meta.env?.BASE_URL ?? './'}models/kenney/structure-platform.glb`;
export const HANGAR_DECK_Y = -1.49;
const DECK_WIDTH = 5.2;
const DECK_DEPTH = 2.4;
const DECK_HEIGHT = .6;
const DECK_Z = -.22;
const FLOOR_Y = HANGAR_DECK_Y - DECK_HEIGHT;
const ignoreRaycast = () => undefined;

/** One local model for the hangars. The deck stays out of the part picker. */
export function HangarPlatform() {
  const [platform, setPlatform] = useState<Group | null>(null);
  const { gl, invalidate } = useThree();

  useEffect(() => {
    let cancelled = false;
    let loaded: Group | undefined;
    void new GLTFLoader().loadAsync(PLATFORM_URL).then(({ scene }) => {
      const mesh = scene.getObjectByName('structure_platform');
      if (cancelled || !(mesh instanceof Mesh) || !(mesh.material instanceof MeshStandardMaterial) || !mesh.material.map) {
        disposeAsset(scene);
        return;
      }
      loaded = scene;
      mesh.raycast = ignoreRaycast;
      mesh.material.color.set('#8fabc1');
      mesh.material.roughness = .62;
      setPlatform(scene);
      invalidate();
    }).catch(() => { /* Keep the neutral deck if the optional GLB cannot load. */ });
    return () => { cancelled = true; if (loaded) disposeAsset(loaded); };
  }, [invalidate]);

  useEffect(() => {
    const canvas = gl.domElement;
    canvas.dataset.hangarPlatform = platform ? 'kenney' : 'fallback';
    return () => { delete canvas.dataset.hangarPlatform; };
  }, [gl, platform]);

  return <>
    <gridHelper args={[8, 16, '#456277', '#263845']} position={[0, FLOOR_Y, DECK_Z]} raycast={ignoreRaycast} />
    {platform ? (
      // The GLB occupies X[-.5,.5], Y[0,.8], Z[-.5,0] after its node scale.
      <group name="kenney-structure-platform" position={[0, FLOOR_Y, DECK_Z + DECK_DEPTH / 2]} scale={[DECK_WIDTH, DECK_HEIGHT / .8, DECK_DEPTH / .5]}>
        <primitive object={platform} />
      </group>
    ) : (
      <mesh name="hangar-platform-fallback" position={[0, HANGAR_DECK_Y - DECK_HEIGHT / 2, DECK_Z]} raycast={ignoreRaycast}>
        <boxGeometry args={[DECK_WIDTH, DECK_HEIGHT, DECK_DEPTH]} />
        <meshStandardMaterial color="#263e51" roughness={.8} />
      </mesh>
    )}
  </>;
}
