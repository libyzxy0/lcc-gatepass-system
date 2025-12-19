export class Broker {
  constructor(state) {
    this.state = state
    this.clients = new Map()
  }

  async fetch(req) {
    if (req.headers.get("Upgrade") === "websocket") {
      const pair = new WebSocketPair()
      const [client, server] = Object.values(pair)

      server.accept()

      server.addEventListener("message", async msg => {
        try {
          const data = JSON.parse(msg.data)

          // Subscribe
          if (data.type === "subscribe") {
            this.clients.set(server, data.topic)
          }

          // Publish (ESP32 → server + others)
          if (data.type === "publish") {
            this.broadcast(data.topic, data.payload)
            await this.forwardToServer(data.topic, data.payload)
          }
        } catch (e) {}
      })

      server.addEventListener("close", () => {
        this.clients.delete(server)
      })

      return new Response(null, { status: 101, webSocket: client })
    }

    if (new URL(req.url).pathname === "/publish") {
      const { topic, payload } = JSON.parse(await req.text())
      this.broadcast(topic, payload)
      return new Response("sent")
    }

    return new Response("not found", { status: 404 })
  }

  broadcast(topic, payload) {
    for (const [ws, t] of this.clients) {
      if (t === topic) {
        ws.send(JSON.stringify({ topic, payload }))
      }
    }
  }

  async forwardToServer(topic, payload) {
    await fetch("https://api.lccgatepass.xyz/iot/data", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer a6c1db7e-92e9-4b2e-9681-61f1fabb3f86"
      },
      body: JSON.stringify({
        topic,
        payload,
        ts: Date.now()
      })
    })
  }
}
