const error = (error, _, res) => {
    console.error(error)
    res.status(500).json({error})
}

module.exports = error