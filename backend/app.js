require('dotenv').config()

const express = require('express')
const mongoose = require('mongoose')
const cookieParser = require('cookie-parser')
const routes = require('./routes')

const port = 3000
const app = express()

// app.use(express.static("../frontend/dist"))
const path = require('path');
app.use(express.static(path.join(__dirname, '../frontend/dist')));
app.use(cookieParser())
app.use(express.json())

app.use('/', routes)

// process.env.DB_CONNECTION_STRING

// console.log(process.env.DB_CONNECTION_STRING)
mongoose.connect(
    process.env.DB_CONNECTION_STRING
    // "mongodb://user:mongopass@localhost:27017/"
).then(() => {
    app.listen(port, () => {
        console.log(`Server started on port ${port}`)
    })
})