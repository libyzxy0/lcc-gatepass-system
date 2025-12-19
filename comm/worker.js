import { Broker } from "./broker.js"

export default {
  async fetch(req, env) {
    const url = new URL(req.url)

    if (url.pathname === "/mqtt") {
      const id = env.BROKER.idFromName("global")
      return env.BROKER.get(id).fetch(req)
    }

    if (url.pathname === "/api/publish" && req.method === "POST") {
      if (req.headers.get("Authorization") !== "Bearer SERVER_SECRET") {
        return new Response("Unauthorized", { status: 401 })
      }

      const id = env.BROKER.idFromName("global")
      return env.BROKER.get(id).fetch("https://broker/publish", {
        method: "POST",
        body: await req.text()
      })
    }

    return new Response("OK")
  }
}

export { Broker }
