<script lang="ts">
  import type { Slide } from '$lib/slide'

  import '../styles/slides.css'
  import Title from './common-components/Title.svelte'

  let { h1, h2, component }: Slide = $props()
</script>

<div class="slide">
  <Title {h1} {h2} />

  {#if component}
    <svelte:component this={component} />
  {/if}
</div>

<style>
  .slide {
    display: flex;
    flex-direction: column;
    align-items: self-start;
  }
</style>
