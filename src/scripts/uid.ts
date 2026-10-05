// A name no other element on the site has, for the ids a component must give its own parts
// (an SVG filter, say, that its styles point at): counted while the site builds, so two of a
// component on one page do not share one.
let count = 0;
export const uid = (prefix: string) => `${prefix}-${++count}`;
