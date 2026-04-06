const mongoose = require('mongoose')


let conn  //store connection instance
let db     // store db instance


const ConnectDB = async() => {
    try {
        if(!conn){
            conn = await mongoose.connect(process.env.MONGO_URI)
            db = conn.connection  //set db insatnce
            console.log("DB connected successfully!")
         }
        return db
    } catch (err) {
        console.log("Failed to connect DB", err.message)
        process.exit(1)
    }    
}




// get db instance function
const getDB = async()=> {
    if(!db) {
        await ConnectDB()
    }
    return db
}



//function to get collection
const getCollection = async(collectionName) => {
    const database = await getDB()
    return database.collection(collectionName)
}



//close connection
const closeConn = async()=> {
    if(conn){
        await mongoose.disconnect()
        conn = null
        db = null
        console.log("DB connection closed")
    }
}




module.exports = { ConnectDB, getDB, getCollection, closeConn };


