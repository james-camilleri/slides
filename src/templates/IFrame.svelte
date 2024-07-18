<script lang="ts">
  import type { Slide } from '$lib/slide'
  import '../styles/slides.css'

  let { iframe }: Slide = $props()
</script>

<div class="slide">
  <iframe title={iframe} src={iframe}></iframe>
</div>

<style>
  iframe {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
  }
</style>
