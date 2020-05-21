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
    const shapeStyles = [
        'tet-l1',   //l1
        'tet-l2',   //l2
        'tet-z1',   //z1
        'tet-z2',   //z2
        'tet-t',    //t
        'tet-o',    //o
        'tet-i'     //i
    ]

    //The Tetrominoes - individual shapes and rotations
    const l1Tetromino = [
        [1, width+1, width*2+1, 2],
        [0, 1, 2, width+2],
        [2, width+2, width*2+2, width*2+1],
        [0, width, width+1, width+2]
    ];
    const l2Tetromino = [
        [1, width+1, width*2+1, width*2+2],
        [0, 1, 2, width+2],
        [2, width+2, width*2+2, width*2+1],
        [0, width, width+1, width+2]
    ]
    const z1Tetromino = [
        [width, width+1, 1, 2],
        [1, width+1, width+2, width*2+2],
        [width, width+1, 1, 2],
        [1, width+1, width+2, width*2+2]
    ];
    const z2Tetromino = [
        [0, 1, width+1, width+2],
        [2, width+2, width+1, width*2+1],
        [0, 1, width+1, width+2],
        [2, width+2, width+1, width*2+1]
    ];
    const tTetromino = [
        [1, width, width+1, width+2],
        [1, width+1, width*2+1, width+2],
        [0, 1, 2, width+1],
        [2, width+2, width*2+2, width+1],
    ];
    const oTetromino = [
        [1, 2, width+1, width+2],
        [1, 2, width+1, width+2],
        [1, 2, width+1, width+2],
        [1, 2, width+1, width+2]
    ];
    const iTetromino = [
        [1, width+1, width*2+1, width*3+1],
        [0, 1, 2, 3],
        [1, width+1, width*2+1, width*3+1],
        [0, 1, 2, 3]
    ];

    //all tetrominoes and their rotations
    const theTetrominoes = [l1Tetromino, l2Tetromino, z1Tetromino, z2Tetromino, tTetromino, oTetromino, iTetromino];

    
    // start in middle position
    let currentPosition = 3;
    // random rotation
    let currentRotation = Math.floor(Math.random() * theTetrominoes[0].length);;

    //randomly select tetromino and its rotation
    let shape = Math.floor(Math.random()*theTetrominoes.length);

    let current = theTetrominoes[shape][currentRotation];

    //draw the tetromino
    function draw() {
        current.forEach(index => {
            squares[currentPosition + index].classList.add('tetromino');
            squares[currentPosition + index].classList.remove('blank');
            squares[currentPosition + index].classList.add(shapeStyles[shape]);
        })
    }
    draw();

    //undraw the Tetromino
    function undraw() {
        current.forEach(index => {
            squares[currentPosition + index].classList.remove('tetromino');
            squares[currentPosition + index].classList.add('blank');
            squares[currentPosition + index].classList.remove(shapeStyles[shape]);
        })
    }


    //assign function to keyCodes
    function control(e) {
        if(e.keyCode === 37) {
            moveLeft();
        } else if (e.keyCode === 38) {
            // rotate();
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
    // function rotate() {
    //     undraw();
    //     currentRotation++;
    //     if (currentRotation == current.length) currentRotation = 0;

    //     current = theTetrominoes[shape][currentRotation];
    //     draw()
    // }

})








// WHat to add
// 0) clean and specialize functionalities
// 1) queue 5 shapes
// 2) styling (borders, shading, shadows, phantom drop)
// 3) spacebar
// 4) grid
// 5) more classes (empty squares, tetrominoes, etc.)