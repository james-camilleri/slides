import { goto } from '$app/navigation'
import { isControlledRemotely } from './remote.svelte'

export function goToSlide(index: number) {
  if (isControlledRemotely) {
    // TODO: Broadcast new slide index.
    return
  }

  goto(`/slides/${index}`)
}
