<script lang="ts">
  import type { Slide } from '$lib/slide'

  import { codeToHtml } from 'shiki'

  import '../styles/slides.css'
  import Title from './common-components/Title.svelte'

  let { h1, h2, code }: Slide = $props()
  let formattedCodePromise = $derived(
    codeToHtml(code?.source ?? '', {
      lang: code?.language ?? 'js',
      theme: 'vesper',
    }),
  )
</script>

<div class="slide dark">
  <Title {h1} {h2} />

  {#if code}
    {#await formattedCodePromise then formattedCode}
      <!-- eslint-disable-next-line svelte/no-at-html-tags -->
      {@html formattedCode}
    {/await}
  {/if}
</div>

<style>
  .slide {
    display: flex;
    flex-direction: column;
    align-items: self-start;
  }

  :global(pre) {
    width: 100%;
    margin: 0;
    overflow-x: hidden;
    background-color: transparent !important;
    scrollbar-width: thin;
    scrollbar-color: var(--react-blue);
  }

  :global(code) {
    font-family: 'fira code', monospace;
    font-size: 0.8rem;
    font-feature-settings: 'calt';
    font-variant-ligatures: contextual;
  }
</style>
