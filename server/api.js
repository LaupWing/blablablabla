const fetch = require("node-fetch")

function getDataWithToken({acces_token, url}){
    return fetch(url,
    {
        headers:
        {
        'Authorization': 'Bearer ' + acces_token
        }
    })
        .then(response=> response.json())
}

function getData(url){
    return fetch(url)
        .then(response=> response.json())
}


const spotifyApi = async (name, acces_token)=>{
    const config = {
        url: `https://api.spotify.com/v1/search?q=${name}&type=artist&limit=5&offset=0`,
        acces_token
    }
    const artist = await getDataWithToken(config)
    return artist
}


module.exports = {spotifyApi}