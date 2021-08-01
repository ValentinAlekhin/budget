const {Router} = require('express')

const UserService = require('../services/UserService')

const router = Router()

router.get('/users', async (req, res) => {
    try {
        const response = await UserService.GetAllUsers()

        res.json(response)
    } catch (e) {
        console.log(e)
        res.status(500).send()
    }
})

router.post('/user', async (req, res) => {
    try {
        const response = await UserService.AddUser(req.body)

        res.json(response)
    } catch (e) {
        console.log(e)
        res.status(500).send()
    }
})

router.put('/user/:id/cost', async (req, res) => {
    try {
        const {id} = req.params

        const response = await UserService.AddCostCategoryByUserId(id, req.body.title)

        res.json(response)
    } catch (e) {
        console.log(e)
        res.status(500).send()
    }
})

router.delete('/user/:id/cost/:cost', async (req, res) => {
    try {
        const {id, cost} = req.params

        const response = await UserService.RemoveCostCategoryByUserId(id, cost)

        res.json(response)
    } catch (e) {
        console.log(e)
        res.status(500).send()
    }
})

router.put('/user/:id/incoming', async (req, res) => {
    try {
        const {id} = req.params

        const response = await UserService.AddIncomingCategoryByUserId(id, req.body.title)

        res.json(response)
    } catch (e) {
        console.log(e)
        res.status(500).send()
    }
})

router.delete('/user/:id/incoming/:inc', async (req, res) => {
    try {
        const {id, inc} = req.params

        const response = await UserService.RemoveIncomingCategoryByUserId(id, inc)

        res.json(response)
    } catch (e) {
        console.log(e)
        res.status(500).send()
    }
})

module.exports = router