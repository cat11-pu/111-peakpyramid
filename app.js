// app.js：渲染结果
import { buildPyramid } from "./level.js";
import { queryRange } from "./window.js";

export function render(spec) {
  const samples = spec.samples || [];
  const pyramid = buildPyramid(samples);
  const span = spec.window || [0, samples.length];
  const view = queryRange(samples, pyramid, span[0], span[1]);
  const all = queryRange(samples, pyramid, 0, samples.length);
  return { level_count: pyramid.length, level2_nodes: (pyramid[2] || []).length,
           window_min: view.min, window_max: view.max, all_min: all.min, all_max: all.max,
           touched: view.touched, cheap_ok: view.touched < samples.length };
}
