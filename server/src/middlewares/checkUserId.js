const UserService = require('../services/UserService')
const { ObjectId } = require('bson')

const checkUserId = async (req, res, next) => {
    try {
        const bearerHeader = req.headers['authorization']

        if (!bearerHeader) {
            return res.sendStatus(400).send()
        }

        const userId = bearerHeader.split(' ')[1]
        if (!ObjectId.isValid(userId)) {
            return res.status(400).json({ errors: 'Not valid id' })
        }

        const targetUser = await UserService.GetUserById(userId)
        if (!targetUser) {
            return res.sendStatus(404).send()
        }

        req.user = { id: userId }

        next();
    } catch (e) {
        console.log(e)
        res.status(500).send()
    }
}

module.exports = checkUserId