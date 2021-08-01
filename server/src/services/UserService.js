const User = require('../models/User')

class UserService {
    async AddUser(user) {
        const newUser = new User(user)

        await  newUser.save()

        return newUser
    }
    async RemoveUserById(id) {
        await User.findByIdAndDelete(id)
    }
    async GetUserById(id) {
        return await User.findById(id).lean()
    }
    async GetAllUsers() {
        return await User.find().lean()
    }
    async AddCostCategoryByUserId(id, title) {
        await User.findByIdAndUpdate(id, {
            $push: {
                costCategories: {
                    title
                }
        }
    })

        return await this.GetUserById(id)
    }
    async AddIncomingCategoryByUserId(id, title) {
        await User.findByIdAndUpdate(id, {$push: {

                incomingCategories: {
                    title
                } }})

        return await this.GetUserById(id)
    }
    async RemoveCostCategoryByUserId(userId, categoryId) {
        await User.findByIdAndUpdate(userId, {$pull: {costCategories: {_id: categoryId}}})

        return await this.GetUserById(userId)
    }
    async RemoveIncomingCategoryByUserId(userId, categoryId) {
        await User.findByIdAndUpdate(userId, {$pull: {incomingCategories: {_id: categoryId}}})

        return await this.GetUserById(userId)
    }
}

module.exports = new UserService()