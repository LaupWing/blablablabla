let vh = window.innerHeight * 0.01;
// Then we set the value in the --vh custom property to the root of the document
document.body.style.setProperty('--vh', `${vh}px`);