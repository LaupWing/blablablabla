const express = require('express')
const session = require('express-session')
const app     = express()
const cors    = require('cors')
const routes  = require('./server/routes')
const oauth   = require('./server/oauth')
require('dotenv').config()
const port = 3001

app
    .set('view engine', 'ejs')
    .set('views', 'views')
    .use(session({
        secret: "Linernotes",
        cookie: {secure: false},
        resave: false,
        saveUninitialized: true
    })) 
    .use(cors())
    .use(express.static("static"))
    .use(oauth)
    .use(routes)
    .listen(port,()=>console.log(`Listening on port ${port}`))
