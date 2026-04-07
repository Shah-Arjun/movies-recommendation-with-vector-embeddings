const { getMovies, getMovieById, getSimilarRecommendMovie } = require('../controller/movieController')
const router = require('express').Router()




router.get('/', getMovies)
router.get('/:id', getMovieById)
router.get('/recommend/:id', getSimilarRecommendMovie)



module.exports = router