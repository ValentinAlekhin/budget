require('dotenv').config()

const {PORT} = process.env

const config = {
    port: PORT || 5000,
}

module.exports = config