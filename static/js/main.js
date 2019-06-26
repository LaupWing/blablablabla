const socket = io()
let url = null
let prevState = []

socket.on('sending artistinfo', (data)=>searchPage.renderSearchResults(data))
socket.on('change artistpage', (obj)=>renderArtistPage(obj))
socket.on('followers info', (list)=>renderFollowingList(list))
socket.on('test', (something)=>console.log(something))

// function init(){
//     activeNav()
//     checkFollowingList()
// }

const init = {
    consoleStyling: 'background: #222; color: #bada55',
    firstEnter: ()=>{
        init.addingEventsToNavLinks()
    },
    addingEventsToNavLinks: ()=> {
        console.log('%c Adding navigation click events', init.consoleStyling)
        const links = Array.from(document.querySelectorAll('nav#nav a'))
        links.push(document.querySelector('.addNew a'))
        addingEvents.links(links)
    }
}

const navigation = {
    navState: ()=>{

    }
}


function checkFollowingList(){
    const list = JSON.parse(localStorage.getItem('following'))
    if(list===null)    return
    socket.emit('list', list)
    // let uri = 'http://localhost:3001/testing'
    // let formData = new FormData()
    // formData.append("testing",'test')
    // let options = {
    //     method: 'POST',
    //     mode: 'cors',
    //     body: formData
    // }
    // let req = new Request(uri, options)
    // fetch(req)
    //     .then(data=>data.text())
    //     .then(res=>console.log(res))
}

function renderFollowingList(list){
    const container = document.querySelector('ul.list')
    removeChilds(container)
    list.forEach(item=>{
        const newEl = `
            <a href="/artist/${item.id}">
                <li data-id="${item.id}">
                    <div class="image-container-following">
                        <img src="${item.image}">
                    </div>
                    <p>${item.name}</p>
                </li>
            </a>
        `
        container.insertAdjacentHTML('beforeend', newEl)
    })
    addingEvents(document.querySelectorAll('.following ul.list a'))   
}

const searchPage= {
    renderSearchResults:(result)=>{
        const container = document.querySelector('section.search-main')
        removeChilds(container)
        const item = result.result
        if(result.foundSomething){
            const img = item.img ? item.img : '/img/placeholder.png' 
            const newElement =`
            <div data-id="${item.id}" class="result-item">
                <a class="result-link" href="/artist/${item.spotifyId}">
                <img class="result-img" src="${img}" alt="">
                <p class="result-name">${item.name}</p>
                </a>
            </div>
            `
            container.insertAdjacentHTML('beforeend', newElement)
            // document.querySelector('a.result-link').addEventListener('click', ()=>{
            //     event.preventDefault()
            // })
            document.querySelector('a.result-link')
            addingEvents.links(document.querySelector('a.result-link'))
        }else{
            const newElement =`
            <div class="error">
                <h3 class="nothing">${item}</h3>
            </div>
            `
            container.insertAdjacentHTML('beforeend', newElement)
        }
    }
}


function renderResults(data){
    console.log('rendering results')
    const container = document.querySelector('section.search-main')
    removeChilds(container)
    if(data===null)     return
    data.items.forEach(item=>{
        const img = item.img ? item.img : '/img/placeholder.png' 
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

const addingEvents = {
    consoleStyling: 'color: orange',
    links: (links)=>{
        console.log('%c Adding events to links or link', addingEvents.consoleStyling)
        if(links.length){
            links.forEach(link=>{
                link.addEventListener('click', goToAnotherPage)
            })
        }else{
            links.addEventListener('click', goToAnotherPage)
        }
    }
}


function goToAnotherPage(){
    console.log('go to another page')
    console.log(this)

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
        fetchHTML.getElement(url)
        container.removeEventListener('transitionend',transitionBridge)
    }
}

function getSearchResults(){
    const input = document.querySelector('#search')
    const deleteInput = document.querySelector('.input-container i')
    deleteInput.addEventListener('click', function(){
        input.value = ''
    })
    input.addEventListener('input', function(){
        if(input.value.length === 0){
            const container = document.querySelector('section.search-main')
            document.querySelector('.input-container i').classList.remove('reveal')
            removeChilds(container)
        }
        else if(input.value.length > 0){
            document.querySelector('.input-container i').classList.add('reveal')
        }
        if(input.value.length >3){
            console.log("emitting search")
            socket.emit('sending searchvalue', this.value)
        }
    })
}

const fetchHTML = {
    getElement: (href)=>{
        const container = document.querySelector('main')
        if(href === 'javascript:void(0);')   return
        fetch(href)
        .then(data=>data.text())
        .then(body=>{
            removeChilds(container)
            container.insertAdjacentHTML('beforeend',body)
            container.classList.remove('fadeAway')
            fetchHTML.checkWhichPage()
        })    
    },
    checkWhichPage: ()=>{
        turnOffLink(false)
        // If the id search excist that means that we are on the searchpage
        if(document.querySelector('input#search')){
            console.log('adding search ')
            getSearchResults()
        }
        // If the class addNew excist that means that we are on the homepage
        if(document.querySelector('.addNew a')){
            addingEvents(document.querySelectorAll('.addNew a'))
        }
        else if(document.querySelector('.image-container-following')){
            addingEvents(document.querySelectorAll('ul.list a'))
        }
        // If the class artist-header excist that means that we are on the artistpage
        if(document.querySelector('header.artist-header')!==null){
            document.querySelector('main').classList.add("artist-page")
            document.querySelector('.btn.btn-follow').addEventListener('click', followingArtist)
            document.querySelector('i.fas.fa-chevron-left').addEventListener('click', getPrevState)
            addingEvents(document.querySelectorAll('li.related-item a'))
            requestingPosts()
        }
    }
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
            // If the id search excist that means that we are on the searchpage
            if(document.querySelector('input#search')){
                console.log('adding search ')
                getSearchResults()
            }
            // If the class addNew excist that means that we are on the homepage
            if(document.querySelector('.addNew a')){
                addingEvents(document.querySelectorAll('.addNew a'))
            }else if(document.querySelector('.image-container-following')){
                addingEvents(document.querySelectorAll('ul.list a'))
            }
            turnOffLink(false)
            // If the class artist-header excist that means that we are on the artistpage
            if(document.querySelector('header.artist-header')!==null){
                document.querySelector('main').classList.add("artist-page")
                document.querySelector('.btn.btn-follow').addEventListener('click', followingArtist)
                document.querySelector('i.fas.fa-chevron-left').addEventListener('click', getPrevState)
                addingEvents(document.querySelectorAll('li.related-item a'))
                requestingPosts()
            }
        })
}


function followingArtist(){
    this.classList.add('followed')
    let list = localStorage.getItem('following') ? JSON.parse(localStorage.getItem('following')) : [] 
    const id = document.querySelector('header.artist-header').dataset.id
    const name = document.querySelector('h1.artist-title').textContent
    list.push({
        id, 
        name
    })
    socket.emit('register list',list)
    localStorage.setItem('following', JSON.stringify(list))
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
            document.querySelector('.filter-btn').addEventListener('click', function(){
                const container = document.querySelector('.filter-screen') 
                container.classList.toggle('reveal')
                if(container.classList.contains('reveal')){
                    console.log('changing marker')
                    document.querySelector('.filter-btn img').src = '/img/checkmark.png'
                }else{
                    document.querySelector('.filter-btn img').src = '/img/filter.png'
                }
                
            })
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


window.addEventListener('load', ()=>init.firstEnter())