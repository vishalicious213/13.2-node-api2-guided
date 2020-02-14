const express = require("express")
const hubs = require("./hubs-model")

const router = express.Router()

// This handles the route /api/hubs
// We no longer have to define the route prefix,
// since it's defined when attaching to the main router in `index.js`
router.get("/", (req, res) => {
	// query strings allow us to pass generic key/values not specific to the resource.
	// they are part of the URL, everything after the question mark (?).
	// e.g. /api/hubs?sortBy=name&limit=5
	const opts ={
		sortBy: req.query.sortBy,
		limit: req.query.limit,
	}

	hubs.find(opts)
		.then((hubs) => {
			res.status(200).json(hubs)
		})
		.catch((error) => {
			console.log(error)
			res.status(500).json({
				message: "Error retrieving the hubs",
			})
		})
})

// This handles the route /api/hubs/:id
router.get("/:id", (req, res) => {
	hubs.findById(req.params.id)
		.then((hub) => {
			// make sure the hub actually exists before we try to return it
			if (hub) {
				res.status(200).json(hub)
			} else {
				res.status(404).json({
					message: "Hub not found",
				})
			}
		})
		.catch((error) => {
			console.log(error)
			res.status(500).json({
				message: "Error retrieving the hub",
			})
		})
})

// This handles POST /api/hubs
router.post("/", (req, res) => {
	if (!req.body.name) {
		return res.status(400).json({
			message: "Missing hub name",
		})
	}

	hubs.add(req.body)
		.then((hub) => {
			res.status(201).json(hub)
		})
		.catch((error) => {
			console.log(error)
			res.status(500).json({
				message: "Error adding the hub",
			})
		})
})

// This handles PUT /api/hubs/:id
router.put("/:id", (req, res) => {
	if (!req.body.name) {
		return res.status(400).json({
			message: "Missing hub name",
		})
	}

	hubs.update(req.params.id, req.body)
		.then((hub) => {
			if (hub) {
				res.status(200).json(hub)
			} else {
				res.status(404).json({
					message: "The hub could not be found",
				})
			}
		})
		.catch((error) => {
			console.log(error)
			res.status(500).json({
				message: "Error updating the hub",
			})
		})
})

// This handles DELETE /api/hubs/:id
router.delete("/:id", (req, res) => {
	hubs.remove(req.params.id)
		.then((count) => {
			if (count > 0) {
				res.status(200).json({
					message: "The hub has been nuked",
				})
			} else {
				res.status(404).json({
					message: "The hub could not be found",
				})
			}
		})
		.catch((error) => {
			console.log(error)
			res.status(500).json({
				message: "Error removing the hub",
			})
		})
})

// This handles GET /api/hubs/:id/messages
router.get("/:id/messages", (req, res) => {
	hubs.findHubMessages(req.params.id)
		.then((messages) => {
			res.status(200).json(messages)
			// or just res.json(messages) since express defaults to a 200
		})
		.catch((error) => {
			console.log(error)
			res.status(500).json({
				message: "Could not get hub messages",
			})
		})
})

// This handles GET /api/hubs/:id/messages/:messageID
router.get("/:hubId/messages/:messageId", (req, res) => {
	hubs.findHubMessageById(req.params.hubId, req.params.messageId)
		.then((message) => {
			if (message) {
				res.json(message)
			} else {
				res.status(404).json({
					message: "Message was not found",
				})
			}
		})
		.catch((error) => {
			console.log(error)
			res.status(500).json({
				message: "Could not get hub message",
			})
		})
})

// This handles POST /api/hubs/:id/messages
router.post("/:id/messages", (req, res) => {
	const { sender, text } = req.body
	if (!sender || !text) {
		// the easiest way to end a request early if we know something is wrong,
		// is to just return. Javascript doesn't run anything in the function after returning.
		return res.status(400).json({
			message: "Need sender and text values",
		})
	}

	hubs.addHubMessage(req.params.id, req.body)
		.then((newMessage) => {
			res.status(201).json(newMessage)
		})
		.catch((error) => {
			console.log(error)
			res.status(500).json({
				message: "Could not create hub message",
			})
		})
})

module.exports = router