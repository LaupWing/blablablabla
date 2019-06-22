const fetch = require("node-fetch")

function getDataWithToken({url,acces_token}){
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


// const spotifyApi = async (name, acces_token)=>{
//     const config = {
//         url: `https://api.spotify.com/v1/search?q=${name}&type=artist&limit=5&offset=0`,
//         acces_token
//     }
//     const artist = await getDataWithToken(config)
//     return artist
// }


const spotifyApi ={
    search: (name, acces_token) =>{
        const config = {
            url: `https://api.spotify.com/v1/search?q=${name}&type=artist&limit=5&offset=0`,
            acces_token
        }
        return getDataWithToken(config)
    },
    artist: (id, acces_token)=>{
        const config = {
            url: `https://api.spotify.com/v1/artists/${id}`,
            acces_token
        }
        return getDataWithToken(config)
    },
    related: (id, acces_token) =>{
        const config= {
            url: `https://api.spotify.com/v1/artists/${id}/related-artists`,
            acces_token
        }
        return getDataWithToken(config)
    },
    topTracks: (id, acces_token) =>{
        const config = {
            url: `https://api.spotify.com/v1/artists/${id}/top-tracks?country=NL`,
            acces_token
        }
        return getDataWithToken(config)
    }
}


module.exports = {spotifyApi}