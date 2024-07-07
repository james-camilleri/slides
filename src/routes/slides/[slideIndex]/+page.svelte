<script lang="ts">
  // TODO: This file should probably be moved somewhere else, or rethought entirely.
  import slides from '../../../_slides'
  import templates from '../../../+templates'
  import { goToSlide } from '$lib/controls'

  let { data }: { data: PageData } = $props()

  // let slideIndex = $state(0)
  let currentSlide = $derived(slides[data.slideIndex])

  // TODO: Type this properly and extract to standalone file.
  function loadTemplate(slide: { template?: string }) {
    return templates[slide.template ?? 'default'] ?? templates.default
  }

  function nextSlide() {
    data.slideIndex < slides.length - 1 && goToSlide(data.slideIndex + 1)
  }

  function previousSlide() {
    data.slideIndex > 0 && goToSlide(data.slideIndex - 1)
  }

  function onKeyPress(e: KeyboardEvent) {
    if (e.key === 'ArrowRight') {
      return nextSlide()
    }

    if (e.key === 'ArrowLeft') {
      return previousSlide()
    }
  }

  function onMouseWheel(e: WheelEvent) {
    if (e.deltaY > 0) {
      return nextSlide()
    }

    if (e.deltaY < 0) {
      return previousSlide()
    }
  }
</script>

<svelte:window onkeydown={onKeyPress} onwheel={onMouseWheel} />

{#key data.slideIndex}
  <svelte:component this={loadTemplate(currentSlide)} {...currentSlide} />
{/key}
