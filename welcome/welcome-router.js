const express = require("express")

const router = express.Router()

router.get("/", (req, res) => {
	res.send(`
		<h1>Lambda Hubs API</h1>
		<p>Welcome to the Lambda Hubs API</p>
	`)
})

router.get("/api", (req, res) => {
	res.json({
		message: "Welcome to the Hubs API",
	})
})

module.exports = router