const express = require('express')
const cors = require('cors')
const mongoose = require("mongoose")

const config = require('../config')
const indexRouter = require('./routes/index')
const checkUserId = require('./middlewares/checkUserId')

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cors())

app.use(checkUserId)
app.use(indexRouter)

const start = async () => {
    try {
        await mongoose.connect(config.mongoUri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
            useFindAndModify: false,
        })

        app.listen(config.port, () =>
            console.log(`Server has been started on port: ${config.port}`)
        )
    } catch (e) {
        console.log(e)
    }
}

start()