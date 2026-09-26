// level.js：金字塔构建（基线：只留第 0 层，不上卷合并）
export function buildPyramid(samples) {
  return [samples.map((value) => ({ min: value, max: value }))];
}
