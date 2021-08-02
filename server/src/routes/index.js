const {Router} = require('express')

const UserService = require('../services/UserService')
const RecordService = require('../services/RecordService')

const router = Router()

router.get('/', async (req, res) => {
    const {id} = req.user

    const response = await UserService.GetUserById(id)

    res.json(response)
})

router.get('/users', async (req, res) => {
    const response = await UserService.GetAllUsers()

    res.json(response)
})

router.post('/user', async (req, res) => {
    const response = await UserService.AddUser(req.body)

    res.json(response)
})

router.put('/user/:id/cost', async (req, res) => {
    const {id} = req.params

    const response = await UserService.AddCostCategoryByUserId(id, req.body.title)

    res.json(response)
})

router.delete('/user/:id/cost/:cost', async (req, res) => {
    const {id, cost} = req.params

    const response = await UserService.RemoveCostCategoryByUserId(id, cost)

    res.json(response)
})

router.put('/user/:id/incoming', async (req, res) => {
    const {id} = req.params

    const response = await UserService.AddIncomingCategoryByUserId(id, req.body.title)

    res.json(response)
})

router.delete('/user/:id/incoming/:inc', async (req, res) => {
    const {id, inc} = req.params

    const response = await UserService.RemoveIncomingCategoryByUserId(id, inc)

    res.json(response)
})

router.get('/records', async (req, res) => {
    const {id} = req.user

    const response = await RecordService.GetRecordsByUserId(id)

    res.json(response)
})

router.post('/records', async (req, res) => {
    const {id} = req.user

    const response = await RecordService.AddNewRecord({...req.body, user: id})

    res.json(response)
})

router.delete('/records/:id', async (req, res) => {
    const {id} = req.params

    await RecordService.RemoveRecordById(id)

    res.json({message: 'Record removed'})
})

router.put('/records/:id', async (req, res) => {
    const {id} = req.params

    const response = await RecordService.UpdateRecordById(id, req.body)

    res.json(response)
})

module.exports = router