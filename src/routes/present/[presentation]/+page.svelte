<script lang="ts">
  import SvelteMarkdown from 'svelte-markdown'
  import { onMount } from 'svelte'
  import type { PageData } from './$types'
  import { remote } from '$lib/remote.svelte'
  import slides from '../../../_slides'
  import { resolveTemplate } from '../../../+templates'
  import { blur, crossfade, fade, fly, slide } from 'svelte/transition'

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
  }

  function previousSlide() {
    remote.send(currentSlideIndex - 1)
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
    {#key currentSlideIndex}
      <svelte:component this={resolveTemplate(currentSlide)} {...currentSlide} />
    {/key}
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
    font-family: sans-serif;
    color: var(--interface-light);
    background: var(--interface-dark);
  }

  .buttons {
    display: grid;
    grid-template-columns: 1fr 1fr;
    height: 10vh;

    button {
      font-size: 1.5rem;
      background: var(--interface-neutral);
      border: 1px solid var(--interface-dark);
      border-radius: 0;
    }
  }

  .preview {
    aspect-ratio: 16 / 9;
  }
</style>
