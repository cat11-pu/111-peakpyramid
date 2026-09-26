// window.js：窗口查询（基线：从头到尾扫一遍样本，不记触及节点）
export function queryRange(samples, pyramid, start, end) {
  let low = null;
  let high = null;
  for (let spot = 0; spot < samples.length; spot += 1) {
    if (samples[spot] < low || low === null) low = samples[spot];
    if (samples[spot] > high || high === null) high = samples[spot];
  }
  return { min: low, max: high, touched: samples.length };
}
