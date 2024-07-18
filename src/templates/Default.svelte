<script lang="ts">
  import type { Slide } from '$lib/slide'

  import SvelteMarkdown from 'svelte-markdown'

  import Image from './common-components/Image.svelte'
  import Text from './common-components/Text.svelte'

  import '../styles/slides.css'

  let { h1, h2, text, image }: Slide = $props()
</script>

<div class="slide">
  {#if h1}
    <h1><SvelteMarkdown source={h1} isInline /></h1>
  {/if}
  {#if h2}
    <h2 class:h2-only={!h1}><SvelteMarkdown source={h2} isInline /></h2>
  {/if}

  {#if image}
    <Image {image} />
  {:else if text}
    <Text {text} />
  {/if}
</div>

<style>
  .slide {
    display: flex;
    flex-direction: column;
    align-items: self-start;
  }

  .h2-only {
    margin-inline-start: 0;
  }
</style>
