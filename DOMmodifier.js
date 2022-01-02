/* client-side */

document.addEventListener('DOMContentLoaded', () => {
    let body = document.getElementsByTagName('body')[0];

    let gridDiv = document.getElementsByClassName('grid')[0];

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

    let miniGridDiv = document.getElementsByClassName('mini-grid')[0];
    // displaying the next tetromino
    for (let i = 0; i < 15; i++) {
        miniGridDiv.appendChild(document.createElement("div"));
    }

    const scoreDisplay = document.querySelector('#score')
    const startBtn = document.querySelector('#start-button')
    // referencing the variables we made in html body
    const grid = document.querySelector('.grid')
    // looks through our html doc and finds the el with classname grid
    // so anything that happens to grid will happen to grid in html file
    let squares = Array.from(document.querySelectorAll('.grid div'))
    // this collects all the divs in our grid
    // now each div will have a specific index number (why? oh arrays lol)

    // the difference between the above two is that one is referencing
    // the divs back on the html, while the other simply turned them into
    // array format, they reference two different objects.

    const width = 10 //'nextLine'
    // we're going to use this as a means of jumping to bigger indexes
    // when constructing the tetris pieces.
    let nextRandom = 0
    let timerId
    let score = 0


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

    //console.log(theTetrominoes[0][0])

    // randomly select tetromino with its first rotation.
    let random = Math.floor(Math.random() * theTetrominoes.length)
    // I don't think I like this method of randomness?

    let current = theTetrominoes[random][currentRotation]
    // first tetromino with its first rotation in the array

    //drawing tetrominos
    function draw() {
        current.forEach(index => {
            squares[currentPosition + index].classList.add('tetromino') // shifting by 4 so we start in the middle
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
    // timerId = setInterval(moveDown, 1000) //where is this even used though?

    // Assign functions to keyCodes
    function control(e) {
        var key = e.keyCode ? e.keyCode : e.which;
        // Some browsers use keyCode, others use which.
        if (key == 37) {
            moveLeft()
        }
        if (key == 38) {
            rotate()
        }
        if (key == 39) {
            moveRight()
        }
        if (key == 40) {
            moveDown()
        }
        if (key == 32) { // spacebar
            dropDown()
        }
    }
    document.addEventListener('keyup', control)

    //go down if possible, recall this updates draw and currentPosition
    function moveDown() {
        undraw()
        if (!(current.some(index => squares[currentPosition + index + width].classList.contains('taken')))) {
            currentPosition += width //goes down one line
        }
        draw() // it goes down, but we must limit the grid so it doesn't clip out
        freeze() //invoking to check condition every second
    }

    // we solve the clipping with a freeze function
    // if a tetromino runs into taken div, turn it to taken.
    function freeze() {
        if (current.some(index => squares[currentPosition + index + width].classList.contains('taken'))) {
            current.forEach(index => squares[currentPosition + index].classList.add('taken'))
            // immediately show the next tetromino
            random = nextRandom // need to change this so it stops updating
            nextRandom = Math.floor(Math.random() * theTetrominoes.length) // again idk if i like this
            current = theTetrominoes[random][currentRotation]
            currentPosition = 4
            // recall curpos doesn't dictate anything about the tetromino, 
            // it's simply a tool to set the coords right.
            draw()
            displayShape()
            addScore()
            gameOver()
        }
    }
    // a lot of things here u want to change
    function moveLeft() {
        undraw()

        //edge case
        const isAtLeftEdge = current.some(index => (currentPosition + index) % width === 0)
        if (!isAtLeftEdge) currentPosition -= 1 //if not at edge, move

        //stop from bumping into other tetrominos
        if (current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
            currentPosition += 1
        }

        draw()
    }

    function moveRight() {
        undraw()

        //edge case
        const isAtRightEdge = current.some(index => (currentPosition + index) % width === (width - 1))
        if (!isAtRightEdge) currentPosition += 1
        //console.log(currentPosition)

        if (current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
            currentPosition -= 1
        }

        draw()
    }

    ///FIX ROTATION OF TETROMINOS A THE EDGE 
    function isAtRight() {
        console.log(currentPosition)
        return current.some(index => (currentPosition + index + 1) % width === 0)
    }

    function isAtLeft() {
        return current.some(index => (currentPosition + index) % width === 0)
    }

    function checkRotatedPosition(P) {
        P = P || currentPosition       //get current position.  Then, check if the piece is near the left side.
        if ((P + 1) % width < 4) {         //add 1 because the position index can be 1 less than where the piece is (with how they are indexed).     
            if (isAtRight()) {            //use actual position to check if it's flipped over to right side
                currentPosition += 1    //if so, add one to wrap it back around
                checkRotatedPosition(P) //check again.  Pass position from start, since long block might need to move more.
            }
        }
        else if (P % width > 5) {
            if (isAtLeft()) {
                currentPosition -= 1
                checkRotatedPosition(P)
            }
        }
    }

    function rotate() {
        undraw()
        currentRotation++
        if (currentRotation === current.length) {
            currentRotation = 0 //reset to first rotation if we get to 4
        }
        current = theTetrominoes[random][currentRotation]
        checkRotatedPosition()
        draw()
    }

    function dropDown() { //atm this stops the timer, fix that
        undraw()
        while (!(current.some(index => squares[currentPosition + index + width].classList.contains('taken')))) {
            currentPosition += width //goes down one line
        }
        draw()
        freeze()
        timerId = setInterval(moveDown, 1000) //fixed timer stopping
    }

    const displaySquares = document.querySelectorAll('.mini-grid div')
    // different method but accomplishes the same thing as 'array from'
    const displayWidth = 4
    const displayIndex = 0

    const upNextTetrominoes = [ // since its a preview, we only care for rotation 0.    
        [1, displayWidth + 1, displayWidth * 2 + 1, 2], // lTetromino
        [0, displayWidth, displayWidth + 1, displayWidth * 2 + 1], // zTetromino
        [1, displayWidth, displayWidth + 1, displayWidth + 2], // tTetromino
        [0, 1, displayWidth, displayWidth + 1], // oTetromino
        [1, displayWidth + 1, displayWidth * 2 + 1, displayWidth * 3 + 1] // iTetromino
    ]


    //display shape in mini-grid display
    function displayShape() {
        displaySquares.forEach(square => {
            square.classList.remove('tetromino')
            // this is because we don't want these to function like usual pieces.
            // these tetrominos are simply for display
        })
        upNextTetrominoes[nextRandom].forEach(index => {
            displaySquares[displayIndex + index].classList.add('tetromino')
            // here, we give, the array coords tetromino, to color the piece in.
            // what is the objective of displayindex?
            // how does the tetromino in display go into play? (its just the same way)
        })
    }

    // add functionality to buttons
    startBtn.addEventListener('click', () => {
        if (timerId) { //the value is not null
            clearInterval(timerId)
            timerId = null
        } else {
            draw()
            timerId = setInterval(moveDown, 1000)
            nextRandom = Math.floor(Math.random() * theTetrominoes.length)
            // fix the above
            displayShape()
        }
    })

    // score function
    function addScore() { // there has to be a better way to write this
        for (i = 0; i < 199; i += width) {
            const row = [i, i + 1, i + 2, i + 3, i + 4, i + 5, i + 6, i + 7, i + 8, i + 9]
            // we will use this to check every row in our grid
            // a tetromino that hits the bottom floor is of taken class
            // every tetromino touching a taken class object becomes a taken class object
            // hence, taken has the transitive property to recursively freeze tetrominos
            // when they touch.

            if (row.every(index => squares[index].classList.contains('taken'))) {
                // this checks every index in row for a taken class block
                // if we have a full row of taken class tetrominos, they must be cleared
                score += 10
                scoreDisplay.innerHTML = score
                // the next logical step is to remove the taken tetrominos
                row.forEach(index => {
                    squares[index].classList.remove('taken')
                    squares[index].classList.remove('tetromino')
                })
                const squaresRemoved = squares.splice(i, width)
                // start index i, splice everything up to width.
                squares = squaresRemoved.concat(squares)
                squares.forEach(cell => grid.appendChild(cell))
                // really odd method of getting rid of the tetrominos, why not just
                // undraw?
                // this appends the taken blocks onto the top of the grid
            }
        }
    }

    function gameOver() {
        if (current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
            scoreDisplay.innerHTML = 'end'
            clearInterval(timerId)
        }
    }
})
