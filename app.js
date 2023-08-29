require('dotenv').config()
require('express-async-errors')

// async errors


// express
const express = require('express')
const app = express()

const notFoundMiddleware = require('./middleware/not-found')
const errorMiddleware = require('./middleware/error-handler')


// mongodb
const connectDB = require('./db/connect')

// middleware
app.use(express.json())


// routes
const productsRouter = require('./routes/router')
app.use('/api/v1/products', productsRouter)

app.get('/', (req, res) => {
  res.send('<h1>Store API</h1><a href="/api/v1/products">products route</a>').status(200)
})






// use middleware
app.use(errorMiddleware)
app.use(notFoundMiddleware)

const PORT = process.env.PORT || 3000

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI)
    app.listen(PORT, () => {console.log(`server listening to port ${PORT}`)})
  } catch (error) {
    console.log(error)
  }
}

start()