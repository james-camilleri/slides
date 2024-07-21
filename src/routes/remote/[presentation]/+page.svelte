<script lang="ts">
  import type { PageData } from './$types'

  import { onMount } from 'svelte'
  import SvelteMarkdown from 'svelte-markdown'

  import Background from '$assets/components/Background.svelte'
  import { remote } from '$lib/remote.svelte'

  import slides from '../../../slides'
  import { resolveTemplate } from '../../../templates'

  let { data }: { data: PageData } = $props()

  let currentSlideIndex = $state(0)
  let currentSlide = $derived(slides[currentSlideIndex])

  onMount(() => {
    if (!data.secret) {
      console.error('Connection secret missing')
      return
    }

    remote.onReceive((index) => {
      currentSlideIndex = index
    })
    remote.connect(data.presentation, data.secret)
  })

  function nextSlide() {
    remote.send(currentSlideIndex + 1)
    navigator.vibrate(50)
  }

  function previousSlide() {
    remote.send(currentSlideIndex - 1)
    navigator.vibrate(50)
  }
</script>

<div class="remote">
  <div class="notes">
    {#each currentSlide.notes ?? [] as note}
      <SvelteMarkdown source={note} />
    {/each}
  </div>
  <div class="buttons">
    <button class="previous" onclick={previousSlide}>&lt; Previous</button>
    <button class="next" onclick={nextSlide}>Next &gt;</button>
  </div>
  <div class="preview">
    <!-- Don't render iframes because the blow up the remote. -->
    {#if !currentSlide.iframe}
      <svelte:component this={resolveTemplate(currentSlide)} {...currentSlide} />
    {/if}
    <Background {currentSlideIndex} {...currentSlide} />
  </div>
</div>

<style>
  .remote {
    display: grid;
    grid-template-rows: 1fr auto auto;
    width: 100vw;
    height: 100vh;
  }

  .notes {
    padding: 1rem 2rem;
    overflow-y: auto;
    font-family: sans-serif;
    font-size: 2rem;
    color: var(--interface-light);
    background: var(--interface-dark);
  }

  .buttons {
    display: grid;
    grid-template-columns: 1fr 1fr;
    height: 20vh;

    button {
      font-size: 1.5rem;
      background: var(--interface-neutral);
      border: 1px solid var(--interface-dark);
      border-radius: 0;
    }
  }

  .preview {
    width: 100%;
    aspect-ratio: 16 / 9;
  }

  :global(html) {
    /* Override base font size in previews. */
    font-size: 12px !important;
  }
</style>
