const express = require('express')
const router  = express.Router()

router.get('/', (req, res)=>{
    res.render('login',{
        stylingPath: '/styles/login.css'
    })
})

router.get('/index', (req, res)=>{
    res.render('index',{
        stylingPath: ''
    })
})

module.exports = router