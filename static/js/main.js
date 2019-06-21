const socket = io()
let url = null

function init(){
    activeNav()
    addingEvents()
}

function addingEvents(){
    const links = document.querySelectorAll('nav#nav a')
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
    const form = input.parentElement
    input.addEventListener('keyup', function(){
        if(this.value.length >3){
            socket.emit('sending searchvalue', this.value)
            // form.addEventListener('submit',()=>event.preventDefault())
            // form.submit()
        }
    })
}


function getElement(href){
    console.log(href)
    const container = document.querySelector('main')
    if(href === 'javascript:void(0);')   return
    fetch(href)
        .then(data=>data.text())
        .then(body=>{
            while(container.firstChild){
                container.removeChild(container.firstChild)
            }
            container.classList.remove('fadeAway')
            container.insertAdjacentHTML('beforeend',body)
            if(url === 'http://localhost:3001/search'){
                getSearchResults()
            }
            turnOffLink(false)
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

function renderResults(){
    fetch()
}

function activeNav(){
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