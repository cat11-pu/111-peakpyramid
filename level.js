// level.js：峰值金字塔构建：每层只扫上一层一遍，两两合并，奇数个节点时末节点原样上卷
function fail(code, message) {
  const error = new Error(message);
  error.code = code;
  return error;
}

export function buildPyramid(samples) {
  if (!Array.isArray(samples) || samples.length === 0) {
    throw fail("E_EMPTY_SAMPLES", "samples must not be empty");
  }
  const pyramid = [samples.map((value) => ({ min: value, max: value }))];
  while (pyramid[pyramid.length - 1].length > 1) {
    const lower = pyramid[pyramid.length - 1];
    const upper = [];
    for (let spot = 0; spot < lower.length; spot += 2) {
      const first = lower[spot];
      const second = lower[spot + 1];
      if (second === undefined) {
        upper.push(first);
      } else {
        upper.push({ min: Math.min(first.min, second.min), max: Math.max(first.max, second.max) });
      }
    }
    pyramid.push(upper);
  }
  return pyramid;
}
