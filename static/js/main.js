const socket = io()
let url = null

socket.on('sending artistinfo', (data)=>{
    renderResults(data)
})

function init(){
    activeNav()
    addingEvents(document.querySelectorAll('nav#nav a'))
}


function renderResults(data){
    const container = document.querySelector('section.search-main')
    removeChilds(container)
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
            if(url === 'http://localhost:3001/search'){
                getSearchResults()
            }
            turnOffLink(false)
            if(document.querySelector('header.artist-header')!==null){
                instgrm.Embeds.process()
                document.querySelector('main').classList.add("artist-page")
                addingEvents(document.querySelectorAll('li.related-item a'))
                soundCloudEmbeds()
            }
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


function activeNav(href){
    const navItems = document.querySelectorAll('nav#nav svg')
    navItems.forEach(item=>{
        if(window.location.pathname==='/index' && item.id ==='nav-home'){
            item.classList.add('active')
        }
        else if(window.location.pathname==='/search' && item.id ==='nav-search'){
            item.classList.add('active')
        }
        else if(window.location.pathname==='/info' && item.id ==='nav-info'){
            item.classList.add('active')
        }
    })
}


window.addEventListener('load', init)