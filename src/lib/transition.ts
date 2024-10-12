import { quintOut } from 'svelte/easing'
import { fade, scale, type TransitionConfig } from 'svelte/transition'

type TransitionFunction = (
  node: Element,
  params: never,
  options?: { direction: 'in' | 'out' | 'both' },
) => TransitionConfig
type SlideTransitions = { in: TransitionFunction; out: TransitionFunction }

export const transition = {
  in: scale,
  out: (node) => fade(node, { easing: quintOut }),
} satisfies SlideTransitions
