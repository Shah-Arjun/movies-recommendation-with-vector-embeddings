const express = require('express')
const dotenv = require('dotenv')
const { connectToMongo } = require('./database/db')

// routes
const movieRoutes = require('./routes/movieRoutes')

dotenv.config()
const app = express()


app.use(express.json());



// text api
app.get('/ping', (req, res)=>{
    res.json({
        message: "pong",
        timestamp: new Date().toISOString()
    })
})


app.use('/api/movies', movieRoutes)



const PORT = 8080
const server = app.listen(PORT, async()=>{
    console.log(`Server running at port: ${PORT}`)
    await connectToMongo()
})