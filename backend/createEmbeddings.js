

// const { getDB, getCollection, closeConn } = require("./database/db");
// const { getEmbeddings } = require("./getHuggingFaceEmbedding");


// // name of db collection where the movie data is stored
// const collection = 'movie';



// // function to update data with embeddings in db
// async function updateMoviewDataWithEmbeddings() {
//     try {
//         const moviesCollection = await getCollection(collection);             // get mongodb collection instance   
//         const cursor = moviesCollection.find({ Plot: { $exists: true } });  // finds all documents where Plot exists

//         for await (const doc of cursor) {        // Loop over each document
//             const inputText = `${doc.Plot} ${doc.Genre} ${doc.Title} ${doc.Actors}`   // prepare input text for embeddings -> combines multiple fields into one string
//             // const embedding = await getEmbeddings(inputText);                         // sent input text to HuggingFace for generating vector embeddings

            
// try {
//     const embedding = await getEmbeddings(inputText);
//     if (!embedding) throw new Error('No embedding returned');
// } catch (err) {
//     console.error(`Error embedding movie: ${doc.Title}`, err.message);
//     continue;
// }

//             doc['plot_embedding'] = embedding;                                 // adds new field plot_embedding to document and save the generated emebddings
//             const result = await moviesCollection.updateOne(
//                 { _id: doc._id },               // filter by _id
//                 { $set: { plot_embedding: embedding } },                  // replace/updates all fields including the new embedding
//                 // { upsert: true }                // upsert option -> create the document if not exist
//             );
//             console.log('result->', result);        // debug   , shows db updated result
//         }


//         console.log('Documents updated successfully.');
//     } catch (err) {
//         console.error(err);
//     } finally {
//         await closeConn();
//     }
// }


// updateMoviewDataWithEmbeddings();



// updateMovieEmbeddings.js
const { getDB, getCollection, closeConn } = require("./database/db");
const { getEmbeddings } = require("./getHuggingFaceEmbedding");


// collection name where movie data is stored
const COLLECTION_NAME = 'movie';


// // function to update movie data with embeddings in db
async function updateMovieDataWithEmbeddings() {
    let moviesCollection;

    try {
        moviesCollection = await getCollection(COLLECTION_NAME);     // connect to db if not already connected and get collection named as 'movie'


        // only process documents that don't have embedding yet
        const cursor = moviesCollection.find({                                     // creates a cursor (pointer) to fetch only those movies that:-
            Plot: { $exists: true },                                               // have a Plot field, and
            plot_embedding: { $exists: false }   // skip already processed ones    //do not have plot_embedding yet
        });

        // to store counts
        let processed = 0;
        let failed = 0;


         // Loop over each document/data
        for await (const doc of cursor) {
            try {
                const inputText = `${doc.Title} ${doc.Genre || ''} ${doc.Plot || ''} ${doc.Actors || ''}`.trim();   //Combines important fields (Title, Genre, Plot, Actors) into one string, .trim() removes extra spaces. This text will be sent to Hugging Face for embedding.

                if (!inputText) {
                    console.log(`Skipping ${doc.Title} - no text content`);
                    continue;
                }

                const embedding = await getEmbeddings(inputText);   //calls and inputtext to Hugging Face API to generate 384-dimensional vector embedding for the movie.

                await moviesCollection.updateOne(            // updates the current movie document in the db by adding the new plot_embedding field absed on _id.
                    { _id: doc._id },
                    { $set: { plot_embedding: embedding } }
                );

                processed++;        //processed doc count
                console.log(`Updated: ${doc.Title} (${processed})`);

                // small delay to avoid rate limits -- avoid blocking by hugging face
                await new Promise(r => setTimeout(r, 100));      //100ms delay = 0.1sec

            } catch (err) {
                failed++;
                console.error(`Failed ${doc.Title}:`, err.message);
                // Continue with next movie instead of crashing
            }
        }

        console.log(`\nEmbeddings Done! Processed: ${processed}, Failed: ${failed}`);

    } catch (err) {
        console.error("Fatal error:", err);   // error like db connection error
    } finally {
        await closeConn();
        console.log("Database connection closed.");
    }
}



// calling the function
updateMovieDataWithEmbeddings();