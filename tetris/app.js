document.addEventListener('DOMContentLoaded', () => {
    const grid = document.querySelector('.grid');   //grid - to delete and add row
    const squares = Array.from(document.querySelectorAll('.grid div')); //all cell in the grid
    const scoreDisplay = document.querySelector('#score'); //score display
    const startBtn = document.querySelector('#start-button'); //start/pause button
    const width = 10; //width of each column and row (width and height)

    let nextshape = 0; //for upNext
    let timerId;        //interval handler
    let score = 0;      //personal score

    // Colours for corresponding tetrominoes
    const colours = [
        'orange',
        'red',
        'purple',
        'green',
        'blue'
    ]

    //The Tetrominoes - individual shapes and rotations
    const lTetromino = [
        [1, width+1, width*2+1, 2],
        [width, width+1, width+2, width*2+2],
        [1, width+1, width*2+1, width*2],
        [width, width*2, width*2+1, width*2+2]
    ]
    const zTetromino = [
        [width*2, width*2+1, width+1, width+2],
        [0, width, width+1, width*2+1],
        [width*2, width*2+1, width+1, width+2],
        [0, width, width+1, width*2+1]
    ];
    const tTetromino = [
        [1, width, width+1, width+2],
        [1, width+1, width*2+1, width+2],
        [width, width+1, width+2, width*2+1],
        [1, width+1, width*2+1, width],
    ];
    const oTetromino = [
        [0, 1, width, width+1],
        [0, 1, width, width+1],
        [0, 1, width, width+1],
        [0, 1, width, width+1]
    ];
    const iTetromino = [
        [1, width+1, width*2+1, width*3+1],
        [width, width+1, width+2, width+3],
        [1, width+1, width*2+1, width*3+1],
        [width, width+1, width+2, width+3]
    ];

    //all tetrominoes and their rotations
    const theTetrominoes = [lTetromino, zTetromino, tTetromino, oTetromino, iTetromino];

    
    // start in middle position
    let currentPosition = 4;
    // random rotation
    let currentRotation = Math.floor(Math.random() * theTetrominoes[0].length);;

    //randomly select tetromino and its rotation
    let shape = Math.floor(Math.random()*theTetrominoes.length);

    let current = theTetrominoes[shape][currentRotation];


    //draw the tetromino
    function draw() {
        current.forEach(index => {
            squares[currentPosition + index].classList.add('tetromino');
            squares[currentPosition + index].style.backgroundColor = colours[shape];
        })
    }




    //undraw the Tetromino
    function undraw() {
        current.forEach(index => {
            squares[currentPosition + index].classList.remove('tetromino');
            squares[currentPosition + index].style.backgroundColor = '';
        })
    }




    //assign function to keyCodes
    function control(e) {
        if(e.keyCode === 37) {
            moveLeft();
        } else if (e.keyCode === 38) {
            rotate();
        } else if (e.keyCode === 39) {
            moveRight();
        } else if (e.keyCode === 40) {
            moveDown();
        }
    }

    document.addEventListener('keydown', control);

    //move down function
    function moveDown() {
        undraw();
        currentPosition += width;
        draw();
        freeze();
    }


    //freeze function
    function freeze() {
        if (current.some(index => squares[currentPosition+index +width].classList.contains('taken'))) {
            current.forEach(index => squares[currentPosition + index].classList.add('taken'));
            // start a new tetromino falling
            shape = nextshape;
            nextshape = Math.floor(Math.random() * theTetrominoes.length);
            currentRotation = Math.floor(Math.random() * theTetrominoes[0].length);
            current = theTetrominoes[shape][currentRotation];
            currentPosition = 4;    // starting position
            draw();
            displayShape();
            addScore();
            gameOver();
        }
    }



    function moveLeft() {
        undraw();
        const isAtLeftEdge = current.some(index => (currentPosition + index) % width === 0);
        
        if (!isAtLeftEdge) currentPosition -= 1;

        if (current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
            currentPosition += 1
        }
        draw();
    }


    function moveRight() {
        undraw();
        const isAtRightEdge = current.some(index => (currentPosition + index) % width === width - 1);

        if (!isAtRightEdge) currentPosition += 1
        
        if (current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
            currentPosition -= 1
        }
        draw();
    }

    // rotate the tetrimino
    function rotate() {
        undraw();
        currentRotation++;
        if (currentRotation == current.length) currentRotation = 0;

        current = theTetrominoes[shape][currentRotation];
        draw()
    }


    //show up-next tetromino in mini-grid
    const displaySquares = document.querySelectorAll('.mini-grid div');
    const displayWidth = 4;
    const displayIndex = 0;
    

    // the Tetrominos without rotations
    const upNextTetrominoes = [
        [1, displayWidth+1, displayWidth*2+1, 2], //lTetromino
        [0, displayWidth, displayWidth+1, displayWidth*2+1], //zTetromino
        [1, displayWidth, displayWidth+1, displayWidth+2], //tTetromino
        [0, 1, displayWidth, displayWidth+1], //oTetromino
        [1, displayWidth+1, displayWidth*2+1, displayWidth*3+1] //iTetromino
    ];


    //display the shape in mini-grid
    function displayShape() {
        //remove any trace of a tetromino from entire grid
        displaySquares.forEach(square => {
            square.classList.remove('tetromino');
            square.style.backgroundColor = '';
        });
        upNextTetrominoes[nextshape].forEach(index => {
            displaySquares[displayIndex + index].classList.add('tetromino');
            displaySquares[displayIndex + index].style.backgroundColor = colours[nextshape];
        })
    }


    //add functionality to the button
    startBtn.addEventListener('click', () => {
        if (timerId) {
            clearInterval(timerId);
            timerId = null;
        } else {
            draw();
            timerId = setInterval(moveDown, 1000);
            nextshape = Math.floor(Math.random() * theTetrominoes.length);
            displayShape();
        }
    })

    //add score
    function addScore() {
        for (let i = 0; i < 199; i += width) {
            const row = [i, i+1, i+2, i+3, i+4, i+5, i+6, i+7, i+8, i+9];

            if (row.every(index => squares[index].classList.contains('taken'))) {
                score += 10;
                scoreDisplay.innerHTML = score;
                row.forEach(index => {
                    squares[index].classList.remove('taken');
                    squares[index].classList.remove('tetromino');
                    squares[index].style.backgroundColor = '';
                });
                const squaresRemoved = squares.splice(i, width);
                squares = squaresRemoved.concat(squares);
                squares.forEach(cell => grid.appendChild(cell));
            }
        }
    }


    // game over
    function gameOver() {
        if (current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
            scoreDisplay.innerHTML = 'end';
            clearInterval(timerId);
        }
    }

})








// WHat to add
// 0) clean and specialize functionalities
// 1) queue 5 shapes
// 2) styling (borders, shading, shadows, phantom drop)
// 3) spacebar
// 4) grid
// 5) more classes (empty squares, tetrominoes, etc.)