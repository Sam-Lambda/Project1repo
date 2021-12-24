/* client-side */

document.addEventListener('DOMContentLoaded', () => {
    let body = document.getElementsByTagName('body')[0];

    let gridDiv = document.createElement("div");
    gridDiv.className = "grid";
    body.appendChild(gridDiv);

    for (let i = 0; i < 200; i++) {
        gridDiv.appendChild(document.createElement("div"));
    }

    // this is to solve freezing, look at movedown
    for (let i = 0; i < 10; i++) {
        //set of divs to act as a floor and avoid clipping
        let takenDiv = document.createElement("div");
        takenDiv.className = "taken";
        gridDiv.appendChild(takenDiv);
    }

    const width = 10 //'nextLine'
    // we're going to use this as a means of jumping to bigger indexes
    // when constructing the tetris pieces.

    const grid = document.querySelector('.grid')
    // looks through our html doc and finds the el with classname grid
    // so anything that happens to grid will happen to grid in html file

    let squares = Array.from(document.querySelectorAll('.grid div'))
    // this collects all the divs in our grid
    // now each div will have a specific index number (why? oh arrays lol)


    // the difference between the above two is that one is referencing
    // the divs back on the html, while the other simply turned them into
    // array format, they reference two different objects.


    const ScoreDisplay = document.querySelector('#score')
    const StartBtn = document.querySelector('#start-button')
    // referencing the variables we made in html body

    //The Tetrominoes
    const lTetromino = [
        [1, width + 1, width * 2 + 1, 2],
        [width, width + 1, width + 2, width * 2 + 2],
        [1, width + 1, width * 2 + 1, width * 2],
        [width, width * 2, width * 2 + 1, width * 2 + 2]
    ]

    const zTetromino = [
        [0, width, width + 1, width * 2 + 1],
        [width + 1, width + 2, width * 2, width * 2 + 1],
        [0, width, width + 1, width * 2 + 1],
        [width + 1, width + 2, width * 2, width * 2 + 1]
    ]

    const tTetromino = [
        [1, width, width + 1, width + 2],
        [1, width + 1, width + 2, width * 2 + 1],
        [width, width + 1, width + 2, width * 2 + 1],
        [1, width, width + 1, width * 2 + 1]
    ]

    const oTetromino = [
        [0, 1, width, width + 1],
        [0, 1, width, width + 1],
        [0, 1, width, width + 1],
        [0, 1, width, width + 1]
    ]

    const iTetromino = [
        [1, width + 1, width * 2 + 1, width * 3 + 1],
        [width, width + 1, width + 2, width + 3],
        [1, width + 1, width * 2 + 1, width * 3 + 1],
        [width, width + 1, width + 2, width + 3]
    ]

    const theTetrominoes = [lTetromino, zTetromino, tTetromino, oTetromino, iTetromino]

    // here they are in beginning positions, but in the function they will be changed.
    let currentPosition = 4  //where first tetromino starts
    let currentRotation = 0
    //let current = theTetrominoes[0][0]

    // randomly select tetromino with its first rotation.
    let random = Math.floor(Math.random() * theTetrominoes.length)
    // I don't think I like this method of randomness?

    let current = theTetrominoes[random][currentRotation]
    // first tetromino with its first rotation in the array

    //drawing tetrominos
    function draw() {
        current.forEach(index => {
            squares[currentPosition + index].classList.add('tetromino')
        })
    }

    //draw()
    //for each item in the array we add a coloring class tetromino
    //we're coloring the divs for each tetromino
    //simply put this colors tetromino div by div

    function undraw() {
        current.forEach(index => {
            squares[currentPosition + index].classList.remove('tetromino')
        })
    } // remove div from grid

    // the time with which the tetromino move (fall) down, is, every second.
    timerId = setInterval(moveDown, 1000) //where is this even used though?

    // function to operate the fall of tetromino pieces
    function moveDown() {
        undraw()
        currentPosition += width //goes down one line
        draw() // it goes down, but we must limit the grid so it doesn't clip out
        freeze() //invoking to check condition every second
    }

    // we solve the clipping with a freeze function
    // if a tetromino runs into taken div, turn it to taken.
    function freeze() {
        if (current.some(index => squares[currentPosition + index + width].classList.contains('taken'))) {
            current.forEach(index => squares[currentPosition + index].classList.add('taken'))
            // immediately drop the next tetromino
            random = Math.floor(Math.random() * theTetrominoes.length) // again idk if i like this
            current = theTetrominoes[random][currentRotation]
            currentPosition = 4
            draw()
        }
    }

})
