const UserService = require('../services/UserService')

const checkUserId = async (req, res, next) => {
    try {
        const bearerHeader = req.headers['authorization']

        if (!bearerHeader) {
            return res.sendStatus(401).send()
        }

        const userId = bearerHeader.split(' ')[1]

        const targetUser = await UserService.GetUserById(userId)
        if (!targetUser) {
            return res.sendStatus(401).send()
        }

        req.user = { id: userId }

        next();
    } catch (e) {
        console.log(e)
        res.status(500).send()
    }
}

module.exports = checkUserId