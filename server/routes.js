const express = require('express')
const router  = express.Router()
const {spotifyApi} = require('./api.js')

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
router.post('/search', async (req,res)=>{
    const searchVal = req.body.search
	const acces_token = req.session.acces_token
    const artist = await spotifyApi(searchVal, acces_token)
    res.send(artist)
})
module.exports = router