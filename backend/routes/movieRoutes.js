const { getMovies, getMovieById } = require('../controller/movieController')
const router = require('express').Router()




router.get('/', getMovies)
router.get('/:id', getMovieById)



module.exports = router