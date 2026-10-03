// The thought of the day: which thought a day shows, as a pure function of the list and the
// day number (whole days since 1 Jan 2026, on the visitor's own calendar). THOUGHTS is
// [[text, day added], ...] in the order of src/data/thoughts.json. Returns the thought, or
// null before any thought is eligible.
//
// A plain function, not a module: the home page inlines this file ahead of its own script (so
// the thought is in place before the first paint), and test/ loads the same file, so what is
// tested is what ships. Its output for a long run of days is pinned in
// test/fixtures/thought-schedule.json: change how it picks and every past day reshuffles.
//
// Rounds. The rotation runs in rounds from the first day any thought is eligible: a round
// takes the pool as it stands on its first day and shows each of those thoughts once, in an
// order shuffled from the round's number. A thought added mid-round waits for the next round,
// so adding thoughts never reshuffles the round in progress and "every thought once before
// any repeat" holds while the list grows.
//
// Walking the rounds from the start keeps this a pure function of the date: the same day
// always lands in the same round with the same order. That holds only if the past never
// changes, so thoughts are appended to thoughts.json with the date they are added, never
// backdated, reordered or deleted (scripts/check-thoughts.mjs holds pull requests to that).
// A round is about as many days as there are thoughts, so even decades out this is a few
// hundred short shuffles.
function pickThought(THOUGHTS, day) {
  // mulberry32, the generator the contour maps draw their noise from.
  const rng = (seed) => () => {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  const shuffle = (pool, round, prevLast) => {
    const order = pool.slice();
    const rand = rng(round);
    for (let i = order.length - 1; i > 0; i--) {
      const j = Math.floor(rand() * (i + 1));
      [order[i], order[j]] = [order[j], order[i]];
    }
    // Backstop: a round never opens on the thought the last one closed on, so no thought
    // shows two days running. Swapping the first two keeps every thought once per round.
    if (order.length > 1 && order[0] === prevLast) [order[0], order[1]] = [order[1], order[0]];
    return order;
  };
  if (!THOUGHTS.length) return null;
  const FIRST = Math.min(...THOUGHTS.map(([, added]) => added)) + 1;
  if (day < FIRST) return null;
  let start = FIRST;
  let prevLast = null;
  for (let round = 0; ; round++) {
    // A thought joins at the midnight after the date it was added.
    const pool = THOUGHTS.filter(([, added]) => added < start);
    const order = shuffle(pool, round, prevLast);
    if (day < start + order.length) return order[day - start];
    prevLast = order[order.length - 1];
    start += order.length;
  }
}
