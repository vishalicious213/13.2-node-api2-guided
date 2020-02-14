const express = require("express")
const welcomeRouter = require("./welcome/welcome-router")
const hubsRouter = require("./hubs/hubs-router")

const server = express()
const port = 4000

server.use(express.json())
// these are not sub-routers, that get attached to the main application.
// helps us keep our endpoints organized in many different files.
server.use("/", welcomeRouter)
server.use("/api/hubs", hubsRouter)

server.listen(port, () => {
	console.log(`Server running at http://localhost:${port}`)
})
