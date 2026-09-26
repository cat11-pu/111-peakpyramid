// level.js：金字塔构建。第 0 层一样本一节点，之后每层两两合并，
// 奇数时最后一个原样上卷，直到只剩一个节点。每层只扫上一层一遍。
export function buildPyramid(samples) {
  if (!samples || samples.length === 0) {
    const error = new Error("samples is empty");
    error.code = "E_EMPTY_SAMPLES";
    throw error;
  }
  const levels = [samples.map((value) => ({ min: value, max: value }))];
  while (levels[levels.length - 1].length > 1) {
    const below = levels[levels.length - 1];
    const above = [];
    for (let spot = 0; spot < below.length; spot += 2) {
      if (spot + 1 < below.length) {
        above.push({
          min: Math.min(below[spot].min, below[spot + 1].min),
          max: Math.max(below[spot].max, below[spot + 1].max)
        });
      } else {
        above.push(below[spot]);
      }
    }
    levels.push(above);
  }
  return levels;
}
