import assert from "node:assert";
import { buildPyramid } from "../level.js";
import { queryRange } from "../window.js";
import { render } from "../app.js";

let failed = 0;
function check(name, fn) {
  try { fn(); console.log("ok " + name); } catch (e) { failed += 1; console.log("FAIL " + name + " :: " + e.message); }
}

check("buildPyramid returns levels", () => {
  assert.ok(Array.isArray(buildPyramid([1, 2, 3])));
  assert.ok(Array.isArray(buildPyramid([1, 2, 3])[0]));
});

check("each level is a node list", () => {
  const levels = buildPyramid([1, 2, 3]);
  assert.ok(levels.every((level) => Array.isArray(level)));
  assert.ok(levels[0].length >= 1);
});

check("queryRange returns numbers", () => {
  const view = queryRange([1, 2, 3], buildPyramid([1, 2, 3]), 0, 3);
  assert.strictEqual(typeof view.min, "number");
  assert.strictEqual(typeof view.max, "number");
});

check("queryRange counts touched nodes", () => {
  assert.strictEqual(typeof queryRange([1, 2, 3], buildPyramid([1, 2, 3]), 0, 2).touched, "number");
});

check("render exposes cheap flag", () => {
  const view = render({ samples: [1, 2, 3], window: [0, 2] });
  assert.strictEqual(typeof view.cheap_ok, "boolean");
  assert.ok(Array.isArray([view.level_count]));
});

console.log("5 cases, " + failed + " failed");
process.exit(failed === 0 ? 0 : 1);
