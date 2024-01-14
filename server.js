import { fastify } from "fastify"
import { DataBaseMemoryPostgres } from "./database-postgres.js"
//import { DataBaseMemory } from "./database-memory.js"

const server = fastify()
const database = new DataBaseMemoryPostgres()

server.post("/videos", async (request, response) => {
    const { title, description, duration } = request.body

    await database.create({
        title: title,
        description: description,
        duration: duration,
    })

    console.log(database.list())

    return response.status(201).send()
})

server.get("/list", async (request, response) => {
    const search = request.query.search
    const videos = await database.list(search)

    return videos
})

server.put("/videos/:id", async (request, response) => {
    const videoId = request.params.id
    const { title, description, duration } = request.body

    await database.update(videoId, {
        title,
        description,
        duration
    })

    return response.status(204).send()
})

server.delete("/videos/:id", async (request, response) => {

    const videoId = request.params.id
    await database.delete(videoId)

    return response.status(204).send()
})

server.listen({
    host: "0.0.0.0",
    port: process.env.PORT ?? 3333,
})