<script lang="ts">
  import type { Slide } from '$lib/slide'

  import SvelteMarkdown from 'svelte-markdown'

  import Image from './common-components/Image.svelte'

  import '../styles/slides.css'

  let { h1, h2, text, image }: Slide = $props()
  let paragraphs = $derived(
    (Array.isArray(text) ? text
    : text ? [text]
    : []
    ).map((text) => (typeof text === 'string' ? { text } : text)),
  )
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
    <div>
      {#each paragraphs as { text, style = { } }}
        {#if text === ''}
          <br />
        {/if}
        <!-- TODO: This style injection isn't the greatest thing. -->
        <p
          style={Object.entries(style)
            .map(([property, style]) => `${property}: ${style}`)
            .join('; ')}
        >
          <SvelteMarkdown source={text} isInline />
        </p>
      {/each}
    </div>
  {/if}
</div>

<style>
  .slide {
    display: flex;
    flex-direction: column;
    align-items: self-start;
  }

  p {
    margin: 0;
  }

  .h2-only {
    margin-inline-start: 0;
  }
</style>
