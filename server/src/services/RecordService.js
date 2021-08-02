const Recod = require('../models/Record')

class RecordService {
    async GetAllRecords() {
        return await Recod.find().lean()
    }

    async GetRecordById(id) {
        return await Recod.findById(id).lean()
    }

    async GetRecordsByUserId(user) {
        return await Recod.find({user}).lean()
    }

    async AddNewRecord(record) {
        const date = Date.now()
        const newRecord = new Recod({...record, date})

        await newRecord.save()

        return await this.GetRecordById(newRecord._id)
    }

    async RemoveRecordById(id) {
        await Recod.findByIdAndDelete(id)
    }

    async UpdateRecordById(id, {comment, amount, category}) {
        await Recod.findByIdAndUpdate(id, {comment, amount, category})

        return await this.GetRecordById(id)
    }
}

module.exports = new RecordService()