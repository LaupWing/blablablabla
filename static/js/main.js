const socket = io()
let url = null
let prevState = []

socket.on('sending artistinfo', (data)=>renderResults(data))
socket.on('change artistpage', (obj)=>renderArtistPage(obj))

function init(){
    activeNav()
    const links = Array.from(document.querySelectorAll('nav#nav a'))
    links.push(document.querySelector('.addNew a'))
    addingEvents(links)
}


function renderResults(data){
    const container = document.querySelector('section.search-main')
    removeChilds(container)
    if(data===null)     return
    data.items.forEach(item=>{
        const img = (item.images.length >0) ? item.images[0].url : '/img/placeholder.png' 
        const newElement =`
        <div data-id="${item.name}" class="result-item">
            <a class="result-link" href="/artist/${item.id}">
            <img class="result-img" src="${img}" alt="">
            <p class="result-name">${item.name}</p>
            </a>
        </div>
        `
        container.insertAdjacentHTML('beforeend', newElement)
    })
    addingEvents(document.querySelectorAll('main a'))
}

function removeChilds(container){
    while(container.firstChild){
        container.removeChild(container.firstChild)
    }
}


function addingEvents(links){
    links.forEach(link=>{
        link.addEventListener('click', goToAnotherPage)
    })
}

function goToAnotherPage(){
    event.preventDefault()
    if(this.href === 'javascript:void(0);')   return
    prevState.push(url)
    url = this.href
    const main = document.querySelector('main')
    main.classList.add('fadeAway')
    turnOffLink(true)
    main.addEventListener('transitionend',transitionBridge)
}
    
function transitionBridge(){
    const container = document.querySelector('main')
    if(event.propertyName === 'opacity'){  
        getElement(url)
        container.removeEventListener('transitionend',transitionBridge)
    }
}

function getSearchResults(){
    const input = document.querySelector('#search')
    input.addEventListener('keyup', function(){
        if(this.value.length >3){
            socket.emit('sending searchvalue', this.value)
        }
    })
}


function getElement(href){
    const container = document.querySelector('main')
    if(href === 'javascript:void(0);')   return
    fetch(href)
        .then(data=>data.text())
        .then(body=>{
            while(container.firstChild){
                container.removeChild(container.firstChild)
            }
            container.insertAdjacentHTML('beforeend',body)
            container.classList.remove('fadeAway')
            if(document.querySelector('input#search')){
                console.log('adding search ')
                getSearchResults()
            }
            if(document.querySelector('.addNew a')){
                addingEvents(document.querySelectorAll('.addNew a'))
            }
            turnOffLink(false)
            if(document.querySelector('header.artist-header')!==null){
                document.querySelector('main').classList.add("artist-page")
                document.querySelector('i.fas.fa-chevron-left').addEventListener('click', getPrevState)
                addingEvents(document.querySelectorAll('li.related-item a'))
                requestingPosts()
            }
        })
}

function changeArtist(nodes){
    nodes.forEach(node=>{
        node.addEventListener('click', function(){
            event.preventDefault()
            console.log(this)
            const id = this.href.split('/artist/')[1]
            socket.emit('getArtistInfo', id)
        })
    })
}

function renderArtistPage(obj){
    const container = document.querySelector('main')
    container.classList.add('fadeAway')
    container.addEventListener('transitionend', ()=>artistTransition(obj))
}

function artistTransition(obj){
    const container = document.querySelector('main')
    container.removeEventListener('transitionend', ()=>artistTransition(obj))
    // Changing artist header
    console.log(obj.artistClean.image)
    document.querySelector('.image-container').style.background  = `
        background:
        linear-gradient(
        rgba(0, 0, 0, 0.45), 
        rgba(0, 0, 0, 0.45)
        ),
        url(${obj.artistClean.image});
        background-size: cover;
    `
    console.log(document.querySelector('.image-container'))
    document.querySelector('.image-container').style.background  = `
        background:pink
    `
    document.querySelector('.header-section.info h1').textContent = obj.artistClean.name

    // Changing related content
    const related = Array.from(document.querySelectorAll('li.related-item'))
    for(let relate of related ){
        relate.querySelector('a').href  = `/artist/${obj.relatedClean.id}`
        relate.querySelector('img').src = obj.relatedClean.image 
        relate.querySelector('h4.related-item-name').textContent = obj.relatedClean.name
    }
    container.classList.remove('fadeAway')
}


function getPrevState(){
    const container = document.querySelector('main')
    let state = prevState[prevState.length-1]
    prevState = prevState.filter(state=>state!==null && state!==prevState[prevState.length-1])
    container.classList.add('fadeAway')
    if(state ==='http://localhost:3001/search') {
        container.classList.remove('artist-page')
    }
    getElement(state)
}

function requestingPosts(){
    fetch('http://localhost:3001/feed')
        .then(data=>data.text())
        .then(feed=>{
            if(document.querySelector('section#feed') === null) return
            document.querySelector('section#feed').innerHTML = feed
            instgrm.Embeds.process()
            soundCloudEmbeds()
        })
}

function soundCloudEmbeds(){
    const allEmbeds = document.querySelectorAll('.putTheWidgetHere')
    if(allEmbeds.length===0)    return
    allEmbeds.forEach((embed,i)=>{
        const url = embed.getAttribute('data-url')
        SC.oEmbed(url, {
            element: document.querySelector(`.putTheWidgetHere#id${i}`)
        });
    })
}

// Prevent the user from clicking the link 2 times
function turnOffLink(disable){
    const links = document.querySelectorAll('nav#nav a')
    links.forEach((link,index)=>{
        if(disable){
            link.href="javascript:void(0);"
        }
        else{
            if(index===0)      link.href="/home"
            else if(index===1) link.href="/search"
            else if(index===2) link.href="/info"
        }
    })
}

function searching(){
    const search = document.querySelector('#search')
    const form = document.querySelector('.search-bar')
    form.addEventListener('submit', submitting)
    search.addEventListener('keyup', function(){
        if(search.value.length >3) {form.submit()}
    })
}

function submitting(){
    event.preventDefault()
    const searchResult = document.querySelector('.result-item')
    if(searchResult === undefined)  renderResults()
    else{

    }
}



function activeNav(){
    const navItems = document.querySelectorAll('.mainNav-item a')
    navItems.forEach(item=>{
        item.addEventListener('click', function(){
            document.querySelector('main').classList.remove('artist-page')
            navItems.forEach(item=>item.classList.remove('active'))
            this.classList.add('active')
        })
    })
    if(navItems[0]===undefined) return
    navItems[0].classList.add('active')
}


window.addEventListener('load', init)