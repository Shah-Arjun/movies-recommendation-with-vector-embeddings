// database/db.js
const { MongoClient } = require("mongodb");
const dotenv = require('dotenv');

dotenv.config();



const uri = process.env.MONGO_URI;
const dbName = "movie_recommendation_db"; 



let client = null;
let db = null;



// function to connect to db
async function connectToMongo() {
    if (client) return client;   // if already connected

    if (!uri) {
        throw new Error("MONGO_URI is not defined in env.");
    }


    client = new MongoClient(uri, {
        maxPoolSize: 50,                 // maximum 50 concurrent connections in the pool
        minPoolSize: 5,
        maxIdleTimeMS: 30000,
        serverSelectionTimeoutMS: 5000,
        connectTimeoutMS: 10000,
    });

    await client.connect();        // connect to db
    db = client.db(dbName);        // once connected, we get a reference to the specific database (movie_recommendation_db).

    console.log("MongoDB connected successfully to database:", dbName);
    
    return client;     // return reference to db
}



// returns the existing database instance or connect if not connected and return
async function getDB() {
    if (!db) {
        await connectToMongo();
    }
    return db;
}



// get collection of db function
async function getCollection(collectionName) {
    if (!collectionName) throw new Error("Collection name is required");
    const database = await getDB();
    return database.collection(collectionName);
}



// close connection to db function
async function closeConn() {
    if (client) {
        await client.close();
        client = null;
        db = null;
        console.log("🔌 MongoDB connection closed");
    }
}



// exports all the functions
module.exports = {
    connectToMongo,  
    getDB,
    getCollection,
    closeConn
};