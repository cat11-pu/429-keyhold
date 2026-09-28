import assert from "node:assert";
import { holdsKey, firstWaiting, relayed } from "../keyhold.js";
import { step, close } from "../holdrun.js";
import { render } from "../app.js";

const base = {
  budget: 1,
  state: { hold: [], queue: [], done: 0, relays: 0, ledger: [], applied: [] },
  events: [{ id: 1, kind: "submit", key: "a", task: 1 }],
  bad_key_code: "E_BAD_KEY", bad_task_code: "E_BAD_TASK",
  dup_task_code: "E_DUP_TASK", no_hold_code: "E_NO_HOLD",
  no_wait_code: "E_NO_WAIT", event_error_code: "E_BAD_EVENT"
};

let failed = 0;
function check(name, fn) {
  try { fn(); console.log("ok " + name); } catch (e) { failed += 1; console.log("FAIL " + name + " :: " + e.message); }
}

check("holdsKey returns a boolean", () => {
  assert.strictEqual(typeof holdsKey(base.state.hold, "a"), "boolean");
});

check("firstWaiting returns a number", () => {
  assert.strictEqual(typeof firstWaiting(base.state.queue, "a"), "number");
});

check("relayed returns a list", () => {
  assert.ok(Array.isArray(relayed([["a", 1]], "a", 2)));
});

check("step returns a state", () => {
  assert.strictEqual(typeof step(base).state, "object");
});

check("render counts events", () => {
  assert.strictEqual(typeof render(base).count_events, "number");
});

console.log("5 cases, " + failed + " failed");
process.exit(failed === 0 ? 0 : 1);
