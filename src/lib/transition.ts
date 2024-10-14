import { quintOut } from 'svelte/easing'
import { type TransitionConfig as SvelteTransitionConfig, fade, scale } from 'svelte/transition'

export type TransitionFunction = (
  node: Element,
  params: never,
  options?: { direction: 'in' | 'out' | 'both' },
) => SvelteTransitionConfig

export type SlideTransitionsConfig = { in: TransitionFunction; out: TransitionFunction }
export type TransitionConfigFunction = (direction: number) => SlideTransitionsConfig

// Add your transitions here.
export const transition: TransitionConfigFunction = () => ({
  in: scale,
  out: (node) => fade(node, { easing: quintOut }),
})
