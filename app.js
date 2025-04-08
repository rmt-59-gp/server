if(process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const express = require('express')
const app = express()
const port = 3000
const router = require('./routes/index')
const errorHandler = require('./middleware/errorHandling')

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use(router)


app.use(errorHandler)
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})