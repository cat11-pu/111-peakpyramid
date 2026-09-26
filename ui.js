// ui.js：操作面板与视图（原生 DOM，无弹窗）
import { render } from "./app.js";

export function mount(spec, parts) {
  let start = (spec.window || [0, 1])[0];
  let end = (spec.window || [0, 1])[1];
  parts.log.textContent = "样本 " + (spec.samples || []).length + " 个，窗口 " + start + " 到 " + end + "。";

  function draw() {
    const scene = Object.assign({}, spec, { window: [start, end] });
    let view = null;
    try {
      view = render(scene);
    } catch (error) {
      parts.out.textContent = String(error && error.code ? error.code : error);
      parts.log.textContent = "跑不动：" + String(error && error.message ? error.message : error);
      return;
    }
    parts.out.textContent = JSON.stringify(view, null, 1);
    parts.stage.textContent = "";
    (spec.samples || []).forEach(function (value, spot) {
      const cell = document.createElement("span");
      cell.className = "chip";
      cell.textContent = String(value);
      const inside = spot >= start && spot < end;
      if (inside) {
        cell.style.background = value === view.window_min ? "#dfe9ff" : "#e6f6ec";
      }
      parts.stage.appendChild(cell);
    });
    const line = document.createElement("div");
    line.className = "row";
    line.textContent = "层级 " + view.level_count + " 层，窗口最小 " + view.window_min
      + "，窗口最大 " + view.window_max + "，全量最小 " + view.all_min + "，全量最大 " + view.all_max
      + "，触及节点 " + view.touched + " 个";
    parts.stage.appendChild(line);
    parts.legend.textContent = "第 2 层有 " + view.level2_nodes + " 个节点";
    parts.log.textContent = "没有扫全量：" + view.cheap_ok;
  }

  const runButton = document.createElement("button");
  runButton.className = "primary";
  runButton.textContent = "查这个窗口";
  runButton.addEventListener("click", draw);
  parts.controls.appendChild(runButton);

  const growButton = document.createElement("button");
  growButton.textContent = "窗口右移一格";
  growButton.addEventListener("click", function () {
    end = Math.min((spec.samples || []).length, end + 1);
    draw();
  });
  parts.controls.appendChild(growButton);

  const shrinkButton = document.createElement("button");
  shrinkButton.textContent = "窗口左移一格";
  shrinkButton.addEventListener("click", function () {
    start = Math.max(0, start - 1);
    draw();
  });
  parts.controls.appendChild(shrinkButton);

  const label = document.createElement("label");
  label.textContent = "窗口起点";
  parts.controls.appendChild(label);

  const box = document.createElement("input");
  box.type = "number";
  box.value = String(start);
  box.addEventListener("input", function () {
    const parsed = Number(box.value);
    if (parsed >= 0) { start = parsed; draw(); }
  });
  parts.controls.appendChild(box);

  const readButton = document.createElement("button");
  readButton.textContent = "只看全量极值";
  readButton.addEventListener("click", function () {
    const scene = Object.assign({}, spec, { window: [start, end] });
    const view = render(scene);
    parts.out.textContent = "全量最小 " + view.all_min + "，全量最大 " + view.all_max
      + "，层级 " + view.level_count + " 层";
  });
  parts.controls.appendChild(readButton);

  draw();
}
