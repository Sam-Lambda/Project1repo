/* client-side */

document.addEventListener('DOMContentLoaded', () => {
    let body = document.getElementsByTagName('body')[0];

    for (let i = 0; i < 200; i++) {
        let divel = document.createElement('div')
        divel.classname = "grid"; //assigning the class to the div element you created
        body.appendChild(divel); 
    }
})