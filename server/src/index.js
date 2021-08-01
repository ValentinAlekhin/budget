const express = require('express')
const cors = require('cors')

const config = require('../config')

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cors())

const start = async () => {
    try {
        app.listen(config.port, () =>
            console.log(`Server has been started on port: ${config.port}`)
        )
    } catch (e) {
        console.log(e)
    }
}

start()