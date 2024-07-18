import type { Slide } from '$lib/slide'

import CentredText from './CentredText.svelte'
import Default from './Default.svelte'
import Start from './Start.svelte'

const templates = {
  default: Default,
  start: Start,
  centredText: CentredText,
} as const

export type TemplateName = keyof typeof templates

export function resolveTemplate(slide: Slide) {
  return templates[slide.template ?? 'default'] ?? templates.default
}
