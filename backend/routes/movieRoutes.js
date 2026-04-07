const { getMovies, getMovieById, getSimilarRecommendMovie, getRecommendMoviesBySearchTerm } = require('../controller/movieController')
const router = require('express').Router()




router.get('/', getMovies)
router.get('/search', getRecommendMoviesBySearchTerm)
router.get('/recommend/:id', getSimilarRecommendMovie)
router.get('/:id', getMovieById)



module.exports = router