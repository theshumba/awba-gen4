/* shared/course-structure.js — the ONE canonical course structure (S6). A classic script assigning
   window.AWBA_COURSE: 4 units (ids/titles/icon keys/desc) + the full 23-node sequence
   (ids/kinds/labels/hrefs). Labels + hrefs are BYTE-COPIED verbatim from learn.html's shipped UNITS
   (incl. the U+2019 curly apostrophes and 'One religion, one thread' — an exact byte-copy file move,
   R6 §5). learn.html + profile.html derive their local shapes from this; no page carries its own copy.
   No storage, no AW.* dependency — loads before each consuming page's inline script. */
window.AWBA_COURSE = {
  units: [
    { n: 1, id: 'u1', icon: 'compass', title: 'The Foundation', desc: 'What belief is, and how to hold it',
      nodes: [
        { id: 'u1m1',  kind: 'lesson', label: 'What sound belief is',   href: 'lessons/u1-m1.html' },
        { id: 'u1m2',  kind: 'lesson', label: 'Why belief matters',     href: 'lessons/u1-m2.html' },
        { id: 'u1m3',  kind: 'lesson', label: 'Where belief comes from',href: 'lessons/u1-m3.html' },
        { id: 'u1m4',  kind: 'lesson', label: 'How we keep it sound',   href: 'lessons/u1-m4.html' },
        { id: 'u1r',   kind: 'review', label: 'Legendary review',       href: 'reviews/u1-review.html' },
        { id: 'u1c',   kind: 'chest',  label: 'A gift' } ] },
    { n: 2, id: 'u2', icon: 'lanterns', title: 'The Drift', desc: 'How belief slips, and how to guard it',
      nodes: [
        { id: 'u2m1',  kind: 'lesson', label: 'The causes within you',  href: 'lessons/u2-m1.html' },
        { id: 'u2m2',  kind: 'lesson', label: 'The pulls from outside',  href: 'lessons/u2-m2.html' },
        { id: 'u2m3',  kind: 'lesson', label: 'Protecting yourself I',   href: 'lessons/u2-m3.html' },
        { id: 'u2m3b', kind: 'lesson', label: 'Protecting yourself II',  href: 'lessons/u2-m3b.html' },
        { id: 'u2r',   kind: 'review', label: 'Legendary review',        href: 'reviews/u2-review.html' },
        { id: 'u2c',   kind: 'chest',  label: 'A gift' } ] },
    { n: 3, id: 'u3', icon: 'kaaba', title: 'The Heart of It: Tawhid', desc: 'The one word everything else serves',
      nodes: [
        { id: 'u3m1',  kind: 'lesson', label: 'What Tawhid is',              href: 'lessons/u3-m1.html' },
        { id: 'u3m2',  kind: 'lesson', label: 'Worth more than everything',  href: 'lessons/u3-m2.html' },
        { id: 'u3m3',  kind: 'lesson', label: 'One religion, one thread',    href: 'lessons/u3-m3.html' },
        { id: 'u3r',   kind: 'review', label: 'Legendary review',            href: 'reviews/u3-review.html' },
        { id: 'u3c',   kind: 'chest',  label: 'A gift' } ] },
    { n: 4, id: 'u4', icon: 'mosque', title: 'The Pillars', desc: 'Standing it up, and knowing it is true',
      nodes: [
        { id: 'u4m1',  kind: 'lesson', label: 'The two pillars',        href: 'lessons/u4-m1.html' },
        { id: 'u4m2',  kind: 'lesson', label: 'The Lord of everything',  href: 'lessons/u4-m2.html' },
        { id: 'u4m2b', kind: 'lesson', label: 'The deniers’ twist',      href: 'lessons/u4-m2b.html' },
        { id: 'u4m3',  kind: 'lesson', label: 'How we know He is there', href: 'lessons/u4-m3.html' },
        { id: 'u4r',   kind: 'review', label: 'The final review',        href: 'reviews/u4-review.html' },
        { id: 'u4c',   kind: 'chest',  label: 'The course gift' } ] }
  ]
};
