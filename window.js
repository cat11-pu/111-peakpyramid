// window.js：窗口查询。把左闭右开区间 [start, end) 分解成金字塔上
// 的少数节点：每层最多碰左右各一个节点，touched 不超过 2 乘层级数。
export function queryRange(samples, pyramid, start, end) {
  if (!samples || samples.length === 0) {
    const error = new Error("samples is empty");
    error.code = "E_EMPTY_SAMPLES";
    throw error;
  }
  if (start < 0 || end > samples.length || start >= end) {
    const error = new Error("bad window [" + start + ", " + end + ")");
    error.code = "E_BAD_WINDOW";
    throw error;
  }
  let low = Infinity;
  let high = -Infinity;
  let touched = 0;
  let lo = start;
  let hi = end;
  for (let depth = 0; lo < hi; depth += 1) {
    const nodes = pyramid[depth];
    if (lo % 2 === 1) {
      if (nodes[lo].min < low) low = nodes[lo].min;
      if (nodes[lo].max > high) high = nodes[lo].max;
      touched += 1;
      lo += 1;
    }
    if (hi % 2 === 1) {
      hi -= 1;
      if (nodes[hi].min < low) low = nodes[hi].min;
      if (nodes[hi].max > high) high = nodes[hi].max;
      touched += 1;
    }
    lo = lo >> 1;
    hi = hi >> 1;
  }
  return { min: low, max: high, touched };
}
