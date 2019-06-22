const express = require('express')
const router  = express.Router()
const {spotifyApi} = require('./api.js')

router.get('/', (req, res)=>{
    res.render('login')
})



router.get('/index', (req, res)=>{
    const io = req.app.get('socketio')
    io.on('connection', socket=>{
        socket.on('sending searchvalue',async (value)=>{
            const data  = await spotifyApi.search(value, req.session.acces_token)
            socket.emit('sending artistinfo', data.artists)            
        })
    })
    res.render('index',{
        currentPage: 'partials/following.ejs',
    })
})

router.get('/home', (req, res)=>{
    res.render('partials/following')
})

router.get('/search', (req, res)=>{
    res.render('partials/search.ejs')
})

router.get('/artist/:id', async(req,res)=>{
    const id = req.params.id
    const acces_token = req.session.acces_token
    console.log(id)
    const artist = await spotifyApi.artist(id, acces_token)
    console.log(artist)
    res.send(artist)
})

module.exports = router