// app.js：渲染结果
import { holdsKey, firstWaiting, relayed } from "./keyhold.js";
import { step, close } from "./holdrun.js";

export function render(spec) {
  const events = spec.events || [];
  const half = Math.ceil(events.length / 2);
  const first = step(spec);
  const closed = close(Object.assign({}, spec, { state: first.state }));
  const r1 = step(Object.assign({}, spec, { events: events.slice(0, half) }));
  const r2 = step(Object.assign({}, spec, { state: r1.state, events: events.slice(half) }));
  const closedTwo = close(Object.assign({}, spec, { state: r2.state }));
  const replay = step(Object.assign({}, spec, { state: closed.state }));
  const wide = step(Object.assign({}, spec, { budget: spec.budget + 2 }));
  const full = step(Object.assign({}, spec, { events: events, budget: events.length + 2 }));
  const fullClosed = close(Object.assign({}, spec, { state: full.state }));
  const fingerprint = function (state) {
    return JSON.stringify({
      hold: state.hold, queue: state.queue, done: state.done, relays: state.relays,
      ledger: state.ledger, applied: state.applied.length
    });
  };
  const named = function (hold) {
    return (hold || []).slice().sort(function (a, b) {
      return a[0] < b[0] ? -1 : a[0] > b[0] ? 1 : 0;
    }).map(function (row) { return [row[0], row[1]]; });
  };
  const pairs = function (list) {
    return (list || []).map(function (row) { return [row[0], row[1]]; });
  };
  return { hold: named(closed.state.hold), queue: pairs(closed.state.queue),
           done: closed.state.done, relays: closed.state.relays,
           served_first: first.served, served_wide: wide.served,
           pair_differs: first.served !== wide.served,
           ledger_before: first.ledger_before,
           ledger: (first.ledger || []).map(function (row) { return row.slice(); }),
           catchup_n: closed.catchup, ledger_after: closed.state.ledger.length,
           mid_differs: fingerprint(r2.state) !== fingerprint(first.state),
           closed_equal: fingerprint(closedTwo.state) === fingerprint(closed.state),
           replay_new: replay.served, judged: first.judged, judged_bound: first.judged_bound,
           full_diff: fingerprint(closed.state) === fingerprint(fullClosed.state) ? 0 : 1,
           count_events: events.length,
           tail: (holdsKey([["a", 1]], "a") ? 1 : 0)
                 + firstWaiting([["a", 2], ["a", 3]], "a")
                 + relayed([["a", 1]], "a", 5)[0][1] };
}
