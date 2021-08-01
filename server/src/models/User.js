const {Schema, model} = require('mongoose')

const schema = new Schema({
    name: {
        type: String,
        required: true,
    },
    incomingCategories: {
        type: [{
            title: {
                type: String,
                required: true,
            }
        }]
    },
    costCategories: {
        type: [{
            title: {
                type: String,
                required: true,
            }
        }]
    }
})

module.exports = model('user', schema)