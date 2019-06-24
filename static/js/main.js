const socket = io()
let url = null
let prevState = []
socket.on('sending artistinfo', (data)=>{
    renderResults(data)
})
// document.body.addEventListener('click', ()=>console.log(url))

function init(){
    activeNav()
    addingEvents(document.querySelectorAll('nav#nav a'))
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
                getSearchResults()
            }
            turnOffLink(false)
            if(document.querySelector('header.artist-header')!==null){
                document.querySelector('main').classList.add("artist-page")
                document.querySelector('i.fas.fa-chevron-left').addEventListener('click', getPrevState)
                addingEvents(document.querySelectorAll('li.related-item a'))
                requestingPosts()
                instgrm.Embeds.process()
                soundCloudEmbeds()
            }
        })
}
function getPrevState(){
    let state = prevState[prevState.length-1]
    prevState = prevState.filter(state=>state!==null && state!==prevState[prevState.length-1])
    getElement(state)
}

function requestingPosts(){
    fetch('http://localhost:3001/feed')
        .then(data=>data.text())
        .then(feed=>{
            if(document.querySelector('section#feed') === null) return
            document.querySelector('section#feed').innerHTML = feed
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