import type { Slide } from '$lib/slide'

import CentredText from './CentredText.svelte'
import Component from './Component.svelte'
import Default from './Default.svelte'
import IFrame from './IFrame.svelte'
import Start from './Start.svelte'

const templates = {
  centredText: CentredText,
  component: Component,
  default: Default,
  iframe: IFrame,
  start: Start,
} as const

export type TemplateName = keyof typeof templates

export function resolveTemplate(slide: Slide) {
  if (slide.component) {
    return templates.component
  }

  if (slide.iframe) {
    return templates.iframe
  }

  return templates[slide.template ?? 'default'] ?? templates.default
}
