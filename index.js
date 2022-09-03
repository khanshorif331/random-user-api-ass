//dependencies
const express = require('express')
const cors = require('cors')
const { errorHandler } = require('./middlewares/errorHandler')
const usersRoutes = require('./routes/usersRoutes/users.routes')

//app config
const app = express()
const port = process.env.PORT || 5000

//middlewares
app.use(cors())
app.use(express.json())

//handle application errors here
app.use(errorHandler)

app.get('/', (req, res) => {
	res.status(200).json({
		success: true,
		message: 'Welcome to Random User Api',
	})
})

// dynamic api routes here
app.use('/api/v1', usersRoutes)

//create server here
app.listen(port, () => console.log(`Listening on Port: ${port}`))

// handle unhandled promise rejections here
process.on('unhandledRejection', (err, promise) => {
	console.log({
		name: err.name,
		message: err.message,
		stack: err.stack,
	})
	// close server
	app.close(() => process.exit(1))
})
