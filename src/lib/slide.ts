import type { TemplateName } from '../templates'
import type { Component } from 'svelte'

// TODO: This style thing is a bit of an abomination.
type Text = string | { text: string; style?: Record<string, string> }

export interface Slide {
  h1?: string
  h2?: string
  text?: Text | Text[]

  code?: {
    source: string
    language: 'js' | 'ts' | 'html' | 'jsx' | 'tsx'
  }
  component?: Component
  iframe?: string
  image?: string
  images?: string | string[]

  template?: TemplateName
  notes?: string[]
}

export interface BackgroundProps extends Slide {
  currentSlideIndex: number
}
