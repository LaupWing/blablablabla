const express = require('express')
const router  = express.Router()

router.get('/', (req, res)=>{
    res.render('login',{
        stylingPath: '/styles/login.css'
    })
})

module.exports = router