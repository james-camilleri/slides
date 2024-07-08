<script lang="ts">
  import type { PageData } from './$types'

  import { qr } from '@svelte-put/qr/svg'

  import { goto } from '$app/navigation'
  import { page } from '$app/stores'
  // TODO: This file should probably be moved somewhere else, or rethought entirely.
  import { remote } from '$lib/remote.svelte'

  import { resolveTemplate } from '../../../+templates'
  import slides from '../../../_slides'

  let { data }: { data: PageData } = $props()
  let currentSlide = $derived(slides[data.slideIndex])

  let remoteConnectUrl = $state('')
  let showRemoteQrCode = $state(false)

  function updateSlideUrl(index: number) {
    goto(`/slides/${index}`)
  }

  function nextSlide() {
    if (remote.active) {
      remote.send(data.slideIndex + 1)
      return
    }

    if (data.slideIndex < slides.length - 1) {
      updateSlideUrl(data.slideIndex + 1)
    }
  }

  function previousSlide() {
    if (remote.active) {
      remote.send(data.slideIndex - 1)
      return
    }

    if (data.slideIndex > 0) {
      updateSlideUrl(data.slideIndex - 1)
    }
  }

  function onKeyPress(e: KeyboardEvent) {
    if (e.key === 'ArrowRight') {
      return nextSlide()
    }

    if (e.key === 'ArrowLeft') {
      return previousSlide()
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

{#key data.slideIndex}
  <svelte:component this={resolveTemplate(currentSlide)} {...currentSlide} />
{/key}

<style>
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
    font-size: 1rem;
  }
</style>
