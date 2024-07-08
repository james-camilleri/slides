import PartySocket from 'partysocket'

import { PUBLIC_PARTYKIT_HOST } from '$env/static/public'

enum SOCKET_STATE {
  DISCONNECTED,
  CONNECTING,
  CONNECTED,
}

enum REMOTE_TYPE {
  HOST,
  CLIENT,
}

class Remote {
  #type: REMOTE_TYPE | undefined
  #socketState = $state(SOCKET_STATE.DISCONNECTED)
  #send = (index: number) => {}
  #onIndexUpdate = (index: number) => {}

  active = $derived(this.#socketState === SOCKET_STATE.CONNECTED)

  /**
   * Called from the host presentation to accept incoming remote control.
   */
  host(currentSlideIndex: number, totalNoOfSlides: number) {
    if (this.#type === REMOTE_TYPE.CLIENT) {
      throw Error('Cannot be a host and a client at the same time')
    }

    this.#type = REMOTE_TYPE.HOST
    this.#socketState = SOCKET_STATE.CONNECTING

    const presentationId = `slides-remote-${crypto.randomUUID()}`
    // TODO: Save this to local storage so we can reconnect on refresh?
    const id = crypto.randomUUID()
    const secret = crypto.randomUUID().replace('-', '')

    const ws = new PartySocket({
      host: PUBLIC_PARTYKIT_HOST || 'localhost:1999',
      room: presentationId,
      id,
      query: { secret, totalSlides: totalNoOfSlides.toString() },
    })

    ws.onopen = (e) => {
      this.#socketState = SOCKET_STATE.CONNECTED
      this.#send = (index: number) => ws.send(JSON.stringify({ slide: index }))

      ws.send(JSON.stringify({ slide: currentSlideIndex }))
    }

    ws.onmessage = (e: MessageEvent<string>) => {
      const { slide } = JSON.parse(e.data) as { slide: number }
      this.#onIndexUpdate(slide)
    }

    return {
      presentationId,
      secret,
    }
  }

  /**
   * Called from the remote interface to connect to a hosting presentation.
   */
  connect(presentationId: string, secret: string) {
    if (this.#type === REMOTE_TYPE.HOST) {
      throw Error('Cannot be a host and a client at the same time')
    }

    this.#type = REMOTE_TYPE.CLIENT
    this.#socketState = SOCKET_STATE.CONNECTING

    // TODO: Save this to local storage so we can reconnect on refresh?
    const id = crypto.randomUUID()

    const ws = new PartySocket({
      host: PUBLIC_PARTYKIT_HOST || 'localhost:1999',
      room: presentationId,
      id,
      query: { secret },
    })

    ws.onopen = (e) => {
      this.#socketState = SOCKET_STATE.CONNECTED
      this.#send = (index: number) => ws.send(JSON.stringify({ slide: index }))
    }

    ws.onmessage = (e: MessageEvent<string>) => {
      const { slide } = JSON.parse(e.data) as { slide: number }
      this.#onIndexUpdate(slide)
    }
  }

  send(slideIndex: number) {
    this.#send(slideIndex)
  }

  onReceive(updateHandler: (index: number) => void) {
    this.#onIndexUpdate = updateHandler
  }
}

export const remote = new Remote()
