import type { Slide } from '$lib/slide'

export default [
  { template: 'start' },
  {
    h1: 'Slide 1',
    text: 'Some plain old ordinary text.',
    notes: ['a note', 'another note', 'a note with *formatting*'],
  },
  {
    h1: 'Slide 2',
    h2: 'with a subtitle',
    text: ['and some text', 'on multiple lines', 'for *gravitas*'],
    notes: ['a single note on slide 2'],
  },
  {
    h1: 'Slide **3**',
    h2: 'The one with *lots* of ~~markdown~~',
    text: ["Coming to think of it this isn't *that* much markdown.", 'But you get the `gist`.'],
  },
] satisfies Slide[]
