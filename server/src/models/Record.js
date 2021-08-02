const {Schema, model} = require('mongoose')

const RecordTypes = require('../enums/RecordTypes')

const schema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        required: true,
    },
    date: {
        type: Date,
        required: true,
    },
    from: {
        type: String,
        enum: Object.values(RecordTypes),
        required: true,
    },
    category: {
        type: Schema.Types.ObjectId,
        required: true,
    },
    amount: {
        type: Number,
        required: true,
    },
    comment: {
        type: String,
    }
    })

module.exports = model('record', schema)