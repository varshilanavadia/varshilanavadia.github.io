// The profiles shown in the bar and named as the same person in the home page's JSON-LD.
export const links = [
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/varshilanavadia/' },
  { label: 'GitHub', href: 'https://github.com/varshilanavadia' },
  { label: 'Strava', href: 'https://www.strava.com/athletes/95580455' },
  { label: 'Instagram', href: 'https://www.instagram.com/varshilanavadia/' },
];

// The home page's sections, in page order: the bar's section links and the marks that follow
// the scroll (Base.astro). Each id is the id of a <section> on the page. A section is listed
// here only once it is built; the bar makes room for however many there are by measuring.
export const sections = [
  { id: 'about', label: 'About' },
  { id: 'work', label: 'Work' },
];
