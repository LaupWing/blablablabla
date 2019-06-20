const express = require('express')
const router  = express.Router()

router.get('/', (req, res)=>{
    res.render('login')
})

router.get('/index', (req, res)=>{
    res.render('index',{
        currentPage: 'partials/following.ejs'
    })
})

router.get('/search', (req, res)=>{
    res.render('index',{
        currentPage: 'partials/search.ejs'
    })
})

module.exports = router