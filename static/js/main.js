function init(){
    activeNav()
    addingEvents()
}

function addingEvents(){
    const form = document.querySelector('.search-bar')
    if(form === undefined)  return
    searching()
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