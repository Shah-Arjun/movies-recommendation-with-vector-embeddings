const { getMovies } = require('../controller/movieController')
const router = require('express').Router()




router.get('/', getMovies)



module.exports = router