function init(){
    activeNav()
    addingEvents()
}

function addingEvents(){
    const form  = document.querySelector('.search-bar')
    const links = document.querySelectorAll('nav#nav a')
    links.forEach(link=>{
        link.addEventListener('click', goToAnotherPage)
    })
    if(form === null)  return
    searching()
}

function goToAnotherPage(){
    event.preventDefault()
    const url = this.href
    const main = document.querySelector('main')
    main.classList.add('fadeAway')
    turnOffLink(true)
    main.addEventListener('transitionend', ()=>{
        console.log(event)
        if(event.propertyName === 'opacity'){   
            getElement(url, main)
        }
    })
}
function getElement(href, container){
    console.log(href)
    if(href === 'javascript:void(0);')   return
    fetch(href)
        .then(data=>data.text())
        .then(body=>{
            while(container.firstChild){
                container.removeChild(container.firstChild)
            }
            container.classList.remove('fadeAway')
            container.insertAdjacentHTML('beforeend',body)
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