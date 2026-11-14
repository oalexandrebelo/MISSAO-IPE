/** Original, approximate coastline outlines, exclusively for the illustration.
 * None of these coordinates, dimensions or curves enter the mission engine. */
export type GeoPoint = readonly [longitude: number, latitude: number];
export const CONTINENTS: readonly (readonly GeoPoint[])[] = [
  [[-168,70],[-153,71],[-141,69],[-133,58],[-126,51],[-125,43],[-121,37],[-117,32],[-111,29],[-108,24],[-104,20],[-98,17],[-91,18],[-87,21],[-86,16],[-82,9],[-77,8],[-80,15],[-84,18],[-81,24],[-80,28],[-81,32],[-76,36],[-72,41],[-65,44],[-60,48],[-55,52],[-61,57],[-65,60],[-71,58],[-78,61],[-81,66],[-88,69],[-95,72],[-104,72],[-113,69],[-126,72],[-137,69],[-150,64],[-162,61],[-168,65]],
  [[-81,11],[-74,12],[-68,10],[-62,10],[-58,7],[-52,4],[-50,0],[-44,-3],[-35,-6],[-35,-11],[-39,-17],[-40,-22],[-46,-25],[-48,-29],[-53,-33],[-57,-39],[-62,-43],[-66,-51],[-68,-55],[-74,-51],[-75,-44],[-74,-36],[-71,-29],[-70,-20],[-75,-15],[-78,-8],[-81,-4],[-79,2],[-77,6]],
  [[-73,77],[-62,81],[-45,84],[-26,81],[-18,75],[-26,69],[-40,60],[-49,60],[-57,66],[-58,72]],
  [[-17,22],[-16,15],[-12,7],[-5,5],[4,5],[9,2],[10,-5],[13,-13],[12,-18],[17,-28],[22,-35],[28,-32],[33,-26],[36,-18],[41,-12],[41,-3],[49,8],[51,12],[44,12],[41,15],[37,21],[32,30],[22,32],[12,33],[9,37],[0,36],[-6,35],[-10,30]],
  [[-10,36],[-9,43],[-1,44],[-5,49],[3,51],[7,55],[9,59],[6,63],[15,70],[25,71],[32,67],[40,65],[52,69],[70,72],[90,76],[113,74],[132,70],[153,71],[169,65],[178,59],[163,57],[152,59],[141,53],[139,44],[131,42],[127,36],[120,30],[122,23],[115,20],[109,11],[104,2],[98,7],[97,16],[91,23],[87,20],[80,8],[76,9],[72,20],[66,25],[59,23],[54,16],[46,13],[43,20],[36,31],[29,36],[24,39],[22,36],[19,40],[16,41],[15,37],[12,42],[8,44],[3,41],[0,38]],
  [[112,-12],[124,-15],[132,-11],[137,-12],[141,-10],[145,-16],[150,-23],[153,-28],[149,-36],[141,-39],[136,-34],[128,-32],[119,-35],[114,-28],[113,-22]],
  [[46,-13],[50,-15],[49,-22],[45,-26],[43,-21]],
  [[130,31],[135,34],[141,40],[145,45],[142,44],[138,38],[133,34]],
  [[-8,50],[-5,51],[-6,55],[-3,59],[0,58],[1,52]],
  [[95,5],[106,-6],[115,-8],[118,-7],[107,-3],[102,3]],
  [[165,-34],[174,-40],[172,-44],[167,-46],[168,-42],[173,-37]],
];

export function surfacePoint(longitude: number, latitude: number, radius: number): [number, number, number] {
  const phi = (longitude + 180) * Math.PI / 180;
  const theta = (90 - latitude) * Math.PI / 180;
  return [-radius * Math.cos(phi) * Math.sin(theta), radius * Math.cos(theta), radius * Math.sin(phi) * Math.sin(theta)];
}

export function circlePositions(radius: number, count = 160, start = 0, end = Math.PI * 2): Float32Array {
  const result = new Float32Array((count + 1) * 3);
  for (let index = 0; index <= count; index += 1) {
    const angle = start + (end - start) * index / count;
    result[index * 3] = Math.cos(angle) * radius;
    result[index * 3 + 1] = Math.sin(angle) * radius;
  }
  return result;
}

export function graticulePositions(radius: number): Float32Array {
  const coordinates: number[] = [];
  for (let latitude = -75; latitude <= 75; latitude += 15) {
    for (let longitude = -180; longitude < 180; longitude += 3) coordinates.push(...surfacePoint(longitude, latitude, radius), ...surfacePoint(longitude + 3, latitude, radius));
  }
  for (let longitude = -180; longitude < 180; longitude += 20) {
    for (let latitude = -90; latitude < 90; latitude += 3) coordinates.push(...surfacePoint(longitude, latitude, radius), ...surfacePoint(longitude, latitude + 3, radius));
  }
  return new Float32Array(coordinates);
}

/** Deterministic illustration noise, unrelated to scientific model state. */
export function randomSeries(seed: number): () => number {
  let value = seed >>> 0;
  return () => { value = (1664525 * value + 1013904223) >>> 0; return value / 4294967296; };
}
