// window.js：基于峰值金字塔的窗口极值查询，逐层取最大可整吃的节点，不回扫样本
function fail(code, message) {
  const error = new Error(message);
  error.code = code;
  return error;
}

export function queryRange(samples, pyramid, start, end) {
  if (start < 0 || end > samples.length || start >= end) {
    throw fail("E_BAD_WINDOW", "window must satisfy 0 <= start < end <= samples.length");
  }
  let low = Infinity;
  let high = -Infinity;
  let touched = 0;
  let pos = start;
  while (pos < end) {
    let picked = null;
    for (let level = pyramid.length - 1; level >= 0; level -= 1) {
      const span = 1 << level;
      if (pos % span !== 0 || pos + span > end) continue;
      const node = pyramid[level][pos >> level];
      if (node !== undefined) { picked = { node, span }; break; }
    }
    low = Math.min(low, picked.node.min);
    high = Math.max(high, picked.node.max);
    touched += 1;
    pos += picked.span;
  }
  return { min: low, max: high, touched };
}
