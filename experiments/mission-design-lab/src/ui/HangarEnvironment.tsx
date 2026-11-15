import { useEffect } from 'react';
import { useThree } from '@react-three/fiber';
import { PMREMGenerator } from 'three';
import type { WebGLRenderTarget } from 'three';

/** Reflection lighting only: the studio is never presented as a space backdrop. */
export function HangarEnvironment() {
  const { gl, scene, invalidate } = useThree();
  useEffect(() => {
    let disposed = false;
    let target: WebGLRenderTarget | undefined;
    const previous = scene.environment, previousIntensity = scene.environmentIntensity;
    void import('three/addons/loaders/HDRLoader.js').then(({ HDRLoader }) => disposed ? null : new HDRLoader().loadAsync(`${import.meta.env?.BASE_URL ?? './'}environments/polyhaven/studio-small-01-1k.hdr`)).then(texture => {
      if (!texture) return;
      if (disposed) { texture.dispose(); return; }
      const generator = new PMREMGenerator(gl);
      try { target = generator.fromEquirectangular(texture); }
      finally { generator.dispose(); texture.dispose(); }
      scene.environment = target.texture; scene.environmentIntensity = .3; invalidate();
    }).catch(() => { /* Directional and ambient lights remain the fallback. */ });
    return () => {
      disposed = true;
      if (target && scene.environment === target.texture) { scene.environment = previous; scene.environmentIntensity = previousIntensity; invalidate(); }
      target?.dispose();
    };
  }, [gl, scene, invalidate]);
  return null;
}
