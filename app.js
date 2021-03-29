const express = require('express')
const cors = require('cors')

const apiRouter = require('./routes/apiRoute')

require('dotenv').config();

const { json, urlencoded } = express
const app = express()

//Ports
const PORT = process.env.PORT || 3001
const HOST = process.env.HOST || "0.0.0.0"

app.use(json())
app.use(urlencoded({ extended: false }))
const corsOptions = { origin: '*', optionsSuccessStatus: 200 }
app.use(cors(corsOptions))




app.get('/',(req,res) =>{
    res.send("Microservice to push to DB");
})

app.post('/pushdata1',(req,res) =>{
    //const input = req.body;
    console.log(req.body);
    res.status(202).json({"status": "OK"})
})

app.use('/api',apiRouter)

// iniciamos nuestro server
app.listen(PORT,HOST, () => { console.log(`Server listening on port ${PORT} and host ${HOST}`); })