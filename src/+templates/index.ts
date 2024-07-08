import Default from './Default.svelte'

const templates = {
  default: Default,
} as const

export type TemplateName = keyof typeof templates

export function resolveTemplate(slide: { template?: TemplateName }) {
  return templates[slide.template ?? 'default'] ?? templates.default
}
