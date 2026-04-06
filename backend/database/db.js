const mongoose = require('mongoose')

const ConnectDB = async() => {
    try {
        await mongoose.connect(process.env.MONGO_URI)
        console.log("DB connected successfully!")
    } catch (err) {
        console.log("Failed to connect DB", err.message)
        process.exit(1)
    }    
}

module.exports = ConnectDB
