<script lang="ts">
  import type { PageData } from './$types'

  import { qr } from '@svelte-put/qr/svg'
  import { onMount } from 'svelte'
  import { quintOut } from 'svelte/easing'
  import { fade, scale } from 'svelte/transition'

  import { beforeNavigate, goto } from '$app/navigation'
  import { page } from '$app/stores'
  import Background from '$assets/components/Background.svelte'
  import { remote } from '$lib/remote.svelte'

  import slides from '../../../slides'
  import { resolveTemplate } from '../../../templates'
  import Controls from '../../components/Controls.svelte'
  import Timer from '../../components/Timer.svelte'

  const imageUrls = slides.reduce((imageUrls, slide) => {
    const { image, images } = slide
    if (image) {
      imageUrls.push(image)
    }

    if (images) {
      imageUrls.push(...(Array.isArray(images) ? images : [images]))
    }

    return imageUrls
  }, [] as string[])

  // Prefetch image URLs for caching.
  onMount(() => {
    imageUrls.map((url) => fetch(url))
  })

  let { data }: { data: PageData } = $props()
  let currentSlide = $derived(slides[data.slideIndex])

  let remoteConnectUrl = $state('')
  let showRemoteQrCode = $state(false)
  let timerStartTime: number | undefined = $state()

  function updateSlideUrl(index: number) {
    goto(`/slides/${index}`)
  }

  function goToSlide(index: number) {
    const nextSlide = Math.max(0, Math.min(slides.length - 1, index))

    if (remote.active) {
      remote.send(nextSlide)
      return
    }

    updateSlideUrl(nextSlide)
  }

  function firstSlide() {
    goToSlide(0)
  }

  function lastSlide() {
    goToSlide(slides.length - 1)
  }

  function jumpForward() {
    goToSlide(data.slideIndex + 10)
  }

  function jumpBack() {
    goToSlide(data.slideIndex - 10)
  }

  function nextSlide() {
    goToSlide(data.slideIndex + 1)
  }

  function previousSlide() {
    goToSlide(data.slideIndex - 1)
  }

  function onKeyPress(e: KeyboardEvent) {
    if (e.key === 'ArrowRight') {
      return nextSlide()
    }

    if (e.key === 'ArrowLeft') {
      return previousSlide()
    }

    if (e.key === 'Home') {
      return firstSlide()
    }

    if (e.key === 'End') {
      return lastSlide()
    }

    if (e.key === 'PageUp') {
      return jumpForward()
    }

    if (e.key === 'PageDown') {
      return jumpBack()
    }

    if (e.key === 'r') {
      if (remoteConnectUrl) {
        showRemoteQrCode = true
        return
      }

      const { presentationId, secret } = remote.host(data.slideIndex, slides.length)
      remote.onReceive(updateSlideUrl)

      remoteConnectUrl = `https://${$page.url.host}/present/${presentationId}?secret=${secret}`
      // TODO: Hide QR code once phone connects.
      showRemoteQrCode = true
    }

    if (e.key === 'Escape') {
      showRemoteQrCode = false
    }

    if (e.key === 't' && !timerStartTime) {
      timerStartTime = Date.now()
    }
  }

  // Capture nav link clicks and re-route to remote if active.
  beforeNavigate(({ cancel, to, type }) => {
    const slideIndex = to?.params?.slideIndex
    if (remote.active && slideIndex && type === 'link') {
      remote.send(Number(slideIndex))
      cancel()
    }
  })
</script>

<svelte:window onkeydown={onKeyPress} />

{#if showRemoteQrCode}
  <div class="overlay">
    <span>Pair remote</span>
    <div class="qr-background">
      <svg
        use:qr={{
          data: remoteConnectUrl,
          shape: 'circle',
        }}
      />
    </div>
    <span class="connect-url">{remoteConnectUrl}</span>
  </div>
{/if}

<div class="timer">
  <Timer startTime={timerStartTime} />
</div>

<div class="controls">
  <Controls baseUrl="/slides" currentSlide={data.slideIndex} lastSlide={slides.length - 1} />
</div>

{#key data.slideIndex}
  <div in:scale out:fade={{ easing: quintOut }}>
  <svelte:component this={resolveTemplate(currentSlide)} {...currentSlide} />
  </div>
{/key}
<Background currentSlideIndex={data.slideIndex} {...currentSlide} />

<div class="iframe-preload">
  {#each slides as slide}
    {#if slide.iframe}
      <iframe title="preload: {slide.iframe}" src={slide.iframe}></iframe>
    {/if}
  {/each}
</div>

<style>
  .timer {
    position: fixed;
    bottom: 1rem;
    left: 1.5rem;
    z-index: 10;
  }

  .controls {
    position: fixed;
    right: 1rem;
    bottom: 1rem;
    z-index: 10;
    opacity: 0.7;
  }

  .overlay {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 1;
    display: flex;
    flex-direction: column;
    gap: 2rem;
    align-items: center;
    justify-content: center;
    width: 100vw;
    height: 100vh;
    font-family: sans-serif;
    font-size: 2rem;
    color: var(--interface-light);
    background: var(--interface-dark-semitransparent);
  }

  .qr-background {
    padding: 1rem;
    background: var(--interface-light);
    border-radius: 1rem;
  }

  svg {
    width: 33vh;
    height: 33vh;
    color: var(--interface-dark);
  }

  .connect-url {
    font-family: monospace;
  }

  .iframe-preload {
    display: none;
  }
</style>
