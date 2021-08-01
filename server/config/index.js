require('dotenv').config()

const {PORT, MONGO_URI} = process.env

const config = {
    port: PORT || 5000,
    mongoUri: MONGO_URI,
}

module.exports = config