const { getCollection } = require('../database/db');




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



