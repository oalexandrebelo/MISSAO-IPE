import { Mesh, Texture } from 'three';
import type { BufferGeometry, Material, Object3D } from 'three';

export function disposeAsset(scene: Object3D) {
  const geometries = new Set<BufferGeometry>(), materials = new Set<Material>();
  const textures = new Set<Texture>(), bitmaps = new Set<ImageBitmap>();
  scene.traverse(node => {
    if (!(node instanceof Mesh)) return;
    geometries.add(node.geometry);
    (Array.isArray(node.material) ? node.material : [node.material]).forEach(material => materials.add(material));
  });
  for (const material of materials) for (const value of Object.values(material)) if (value instanceof Texture) textures.add(value);
  for (const texture of textures) {
    const image = texture.source.data;
    if (typeof ImageBitmap !== 'undefined' && image instanceof ImageBitmap) bitmaps.add(image);
    texture.dispose();
  }
  // ImageBitmap data needs explicit release; several meshes may share one image.
  bitmaps.forEach(bitmap => bitmap.close());
  materials.forEach(material => material.dispose()); geometries.forEach(geometry => geometry.dispose());
}
