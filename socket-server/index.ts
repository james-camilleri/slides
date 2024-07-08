import type * as Party from 'partykit/server'

export default class Server implements Party.Server {
  #secret: string | null = null
  #currentSlide = 0
  #totalSlides = 0

  constructor(readonly room: Party.Room) {}

  onConnect(connection: Party.Connection, { request }: Party.ConnectionContext) {
    const secret = new URL(request.url).searchParams.get('secret')
    const totalSlides = new URL(request.url).searchParams.get('totalSlides')

    if (!this.#secret) {
      this.#secret = secret
    }

    if (totalSlides != null) {
      this.#totalSlides = Number(totalSlides)
    }

    // TODO: Get some sort of auth working properly.
    if (this.#secret !== secret) {
      return
      // return new Response('Connection secret required', { status: 401 })
    }

    if (this.#currentSlide != null) {
      connection.send(JSON.stringify({ slide: this.#currentSlide }))
    }
  }

  onMessage(message: string, sender: Party.Connection) {
    const { slide } = JSON.parse(message) as { slide: number }
    const sanitisedIndex = Math.max(0, Math.min(this.#totalSlides - 1, slide))

    if (sanitisedIndex != null && sanitisedIndex !== this.#currentSlide) {
      this.#currentSlide = slide

      // Broadcast to all listeners, including the original sender.
      this.room.broadcast(JSON.stringify({ slide: sanitisedIndex }))
    }
  }
}

Server satisfies Party.Worker
