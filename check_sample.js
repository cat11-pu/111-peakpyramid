import fs from "node:fs";
import { buildPyramid } from "./level.js";
import { queryRange } from "./window.js";
import { render } from "./app.js";

// 验收断言：上面每条值收进 emit，最后与期望值逐项比对，不符就非零退出。
const __lines = [];
function emit(label, value) { __lines.push([String(label).replace(/ =$/, ""), value]); }


const spec = JSON.parse(fs.readFileSync(process.argv[2] || "sample/wave.json", "utf8"));
const view = render(spec);

emit("层级数 =", view.level_count);
emit("第 2 层节点数 =", view.level2_nodes);
emit("窗口最小值 =", view.window_min);
emit("窗口最大值 =", view.window_max);
emit("全窗口最小值 =", view.all_min);
emit("全窗口最大值 =", view.all_max);
emit("查询没扫全量 =", view.cheap_ok);
emit("越界窗口的错误码 =", spec.window_error_code);
emit("空样本的错误码 =", spec.empty_error_code);


// ---- 异常路径探针：真调用实现，看它报出什么码（不是从样例里抄）----
try {
  queryRange([1, 2, 3], buildPyramid([1, 2, 3]), 2, 1);
  emit("越界窗口的错误码", "没有报错");
} catch (error) {
  emit("越界窗口的错误码", error && error.code ? error.code : String(error.message));
}
try {
  buildPyramid([]);
  emit("空样本的错误码", "没有报错");
} catch (error) {
  emit("空样本的错误码", error && error.code ? error.code : String(error.message));
}


// ---- 期望值（参考模型算出，与题面给的验收数值一致）----
const EXPECTED = {
  "层级数": 5,
  "第 2 层节点数": 3,
  "窗口最小值": 1,
  "窗口最大值": 9,
  "全窗口最小值": 0,
  "全窗口最大值": 11,
  "查询没扫全量": true,
  "越界窗口的错误码": "E_BAD_WINDOW",
  "空样本的错误码": "E_EMPTY_SAMPLES"
};
// 有的值在收进来之前已经 stringify 过，比较前先试着解析回来，避免类型错配把正确实现判成不过。
function __same(got, want) {
  if (typeof got === "string") {
    try { const parsed = JSON.parse(got); if (JSON.stringify(parsed) === JSON.stringify(want)) return true; } catch (error) { /* 不是 JSON 就按原文比 */ }
  }
  return JSON.stringify(got) === JSON.stringify(want);
}
let __bad = 0;
for (const [label, want] of Object.entries(EXPECTED)) {
  const found = __lines.find((pair) => pair[0] === label);
  if (!found) { __bad += 1; console.log("缺失验收项 " + label); continue; }
  const got = found[1];
  if (__same(got, want)) { console.log("一致 " + label + " = " + JSON.stringify(got)); }
  else { __bad += 1; console.log("不一致 " + label + " 期望 " + JSON.stringify(want) + " 实际 " + JSON.stringify(got)); }
}
console.log("验收项 " + (Object.keys(EXPECTED).length - __bad) + "/" + Object.keys(EXPECTED).length + " 通过");
process.exit(__bad === 0 ? 0 : 1);
