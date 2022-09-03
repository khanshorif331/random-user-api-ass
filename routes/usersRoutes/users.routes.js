//dependencies
const express = require('express')
const {
	getRandomUser,
	getAllUsers,
	postUser,
	updateUser,
	bulkUpdate,
	deleteUser,
} = require('../../controllers/users.controller')

//module scaffolding
const usersRoutes = express.Router()

//export module
module.exports = usersRoutes
