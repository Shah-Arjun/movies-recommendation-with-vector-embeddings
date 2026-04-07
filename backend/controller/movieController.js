const { ObjectId } = require('mongodb');
const { getAggregationPipeline } = require('../utils/aggregationPipeline');
const { getCollection } = require('../database/db');
const { getEmbeddings } = require('../getHuggingFaceEmbedding');




//  GET all movies --> implement pagination of 100 items
exports.getMovies = async(req, res) => {
    try {
        // Extract pagination parameters from query string
        const page = parseInt(req.query.page) || 1;            //get pagen no from query string || 1
        const limit = parseInt(req.query.limit) || 100;       // get limit to show items from query string || 100   per page
        const skip = (page - 1) * limit;                     // calculates how many documents to skip for pagination. eg. Page 1 -> skip = 0, Page 2 -> skip = 100, .....
        
        
        if (page < 1) {
            return res.status(400).json({
                message: 'Page number must be greater than 0'
            });
        }

        if (limit < 1 || limit > 100) {
            return res.status(400).json({
                message: 'Limit must be between 1 and 100'
            });
        }

        
        const collection = await getCollection('movie');   // get the mondoDb collection named 'movie' using helper function
        const movies = await collection
            .find({}, { projection: { plot_embedding: 0 } })        // finds all the documents/items and exclude the plot_exbeddings field as it to too large and we dont need it in frontend
            .skip(skip)                                        // skip the calculated no. of doc/items
            .limit(limit)                                      // limkts the no. of document returned
            .toArray();                                        // convert to array
        
        // console.log(movies)      //debug

        res.status(200).json({
            message: `Showing ${movies.length} movies of page ${page}.`,
            data: movies
        });
    } catch (err) {
        res.status(500).json({
            message: 'Internal Server Error',
            error: err.message
        });
    }
}






// GET  a movie by id
exports.getMovieById = async (req, res) => {
    try {
        const movieId = req.params.id;                
        const collection = await getCollection('movie');

        //find current movie by id
        const movie = await collection.findOne(
            { _id: new ObjectId(movieId) },
            { projection: { plot_embedding: 0 } }     // fetch movie excluding plot_embedding
        );

        if (!movie) {
            return res.status(404).json({
                message: 'Movie not found'
            });
        }

        res.status(200).json({
            message: "Movie found",
            data: movie
        });
    } catch (error) {
        console.error(error)
        res.status(500).json({
            message: 'Internal Server Error',
            error: error.message
        });
    }
}






// GET recommended movies against a movie
exports.getSimilarRecommendMovie = async (req, res) => {
    try {
        const movieId = req.params.id;
        const collection = await getCollection('movie')

        // console.log("movieid---> ", movieId)    //debug
        const { plot_embedding } = await collection.findOne(          // get only plot_embeddings of a current movie by _id
            { _id: new ObjectId(movieId) },
            { projection: { plot_embedding: 1 } }          
        );

        // console.log('movie plot emb length->', plot_embedding.length); //debug

        const aggregationPipeline = getAggregationPipeline(plot_embedding, movieId);   //get top 10 similar recommendaions

        const movies = await collection            // executes the vector search using MongoDB Aggregation and converts the result into a JavaScript array. This returns the top 10 similar movies with similarity score.
            .aggregate(aggregationPipeline)          // performs vetcor search
            .toArray();                              // convarts rresult into array

        res.status(200).json({                        // sends top 20 similar movie json data in response to frontend
            message: "Top 10 similar movie are: ",
            data: movies
        });
    } catch (error) {
        console.log(error)
        res.status(500).json({
            message: 'Internal Server Error',
            error: error.message
        });
    }
}




// semantic search
// get recommended movies based on search text/term (semantic search) using hugging face sentence-transformer
exports.getRecommendMoviesBySearchTerm = async (req, res) => {
    try {
        // console.log("--------->", req.query) 
        const { query } = req.query;           // destructure the query parameter from the url

        if (!query || query.trim() === '') {
            return res.status(400).json({
                success: false,
                message: "Search query is required"
            });
        }
        // console.log('query->', query);

        const plot_embedding = await getEmbeddings(query);      // converts the users search text into a 384-dimensional embedding using Hugging Face.

        // console.log('movie------>', plot_embedding.length);

        const collection = await getCollection('movie')
        const aggregationPipeline = getAggregationPipeline(plot_embedding);      // calls aggregation pipeline function to build the vector search query based on embeddings
        
        const searchResult = await collection                   // runs the vector search on MongoDB and converts results to an array.
            .aggregate(aggregationPipeline)               
            .toArray();


        res.status(200).json({
            message: `Top ${searchResult.length} similar search reasults are: `,
            count: searchResult.length,
            data: searchResult
        });
    } catch (error) {
        console.error("Error in getRecommendMoviesBySearchTerm:", error);        
        res.status(500).json({
            message: 'Internal Server Error',
            error: error.message
        });
    }
}