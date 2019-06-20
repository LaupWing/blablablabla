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