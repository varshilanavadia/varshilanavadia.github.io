// The site's one spring, after Motion's: a damped spring from 0 to 1, given as how long it
// should look to take and how much it may bounce, sampled every 10ms into CSS's linear()
// easing so the browser plays it with no script running. Apple-like: settled in about half a
// second, with a bounce too small to see as one.
//
// Base.astro works it out while the site builds and hands it to every page as --spring and
// --spring-time, so the bar, the Work rows and anything later all move the same way. It was
// the bar's alone, worked out in the browser, until the sections needed it too (3 Oct 2026).
// test/spring.test.js pins what it returns: change it and everything that moves changes.
export const spring = (visual = 0.35, bounce = 0.1) => {
  const w = (2 * Math.PI) / (visual * 1.2); // natural frequency
  const z = 1 - bounce; // damping ratio
  const at = (t: number) => {
    if (z >= 1) return 1 - Math.exp(-w * t) * (1 + w * t);
    const wd = w * Math.sqrt(1 - z * z);
    return 1 - Math.exp(-z * w * t) * (Math.cos(wd * t) + ((z * w) / wd) * Math.sin(wd * t));
  };
  // Long enough to settle within a thousandth of the way.
  let end = 0;
  for (let t = 0; t < 3; t += 0.01) if (Math.abs(1 - at(t)) > 0.001) end = t;
  const time = end + 0.01;
  const points: number[] = [];
  for (let i = 0; i * 0.01 <= time + 1e-9; i++) points.push(Math.round(at(i * 0.01) * 10000) / 10000);
  points[points.length - 1] = 1;
  return { easing: `linear(${points.join(', ')})`, time };
};
