document.addEventListener('DOMContentLoaded', () => {
    const grid = document.querySelector('.grid');   //grid - to delete and add row
    const squares = Array.from(document.querySelectorAll('.grid div')); //all cell in the grid
    const width = 10; //width of each column and row (width and height)
    const topRows = document.querySelectorAll('.top-container').length;

    let timerId;        //interval handler
    let interrupts;     //interrupt handler

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
        [0, width, width*2, 1],
        [0, 1, 2, width+2],
        [2, width+2, width*2+2, width*2+1],
        [width, width*2, width*2+1, width*2+2]
    ];
    const l2Tetromino = [
        [0, width, width*2, width*2+1],
        [0, 1, 2, width],
        [1, 2, width+2, width*2+2],
        [width*2, width*2+1, width*2+2, width+2]
    ]
    const z1Tetromino = [
        [width, width+1, 1, 2],
        [1, width+1, width+2, width*2+2],
        [width*2, width*2+1, width+1, width+2],
        [0, width, width+1, width*2+1]
    ];
    const z2Tetromino = [
        [0, 1, width+1, width+2],
        [2, width+2, width+1, width*2+1],
        [width, width+1, width*2+1, width*2+2],
        [1, width+1, width, width*2]
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
        [2, width+2, width*2+2, width*3+2],
        [width*2, width*2+1, width*2+2, width*2+3]
    ];

    //all tetrominoes and their rotations
    const theTetrominoes = [l1Tetromino, l2Tetromino, z1Tetromino, z2Tetromino, tTetromino, oTetromino, iTetromino];

    
    // start in middle position
    let currentPosition = 4;

    // random rotation
    let currentRotation = Math.floor(Math.random() * theTetrominoes[0].length);
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

    //undraw the Tetromino
    function undraw() {
        current.forEach(index => {
            squares[currentPosition + index].classList.remove('tetromino');
            squares[currentPosition + index].classList.add('blank');
            squares[currentPosition + index].classList.remove(shapeStyles[shape]);
        })
    }

    function newShape() {
        currentPosition = 4 + topRows;
        shape = Math.floor(Math.random()*theTetrominoes.length);
        currentRotation = Math.floor(Math.random() * theTetrominoes[0].length);
        current = theTetrominoes[shape][currentRotation];

        while (!current.some(index => squares[currentPosition + index].classList.contains('top'))) {
            currentPosition -= width;
        };
    }

    function lower() {
        undraw();

        currentPosition += width;
        checkBottom();

        draw();
    }

    function moveDown() {
        if (!interrupts) {
            undraw();

            currentPosition += width;
            checkBottom();
            
            draw();
        }
    }

    function moveLeft() {
        undraw();
        const isAtLeftEdge = current.some(index => (currentPosition + index) % width === topRows);
        
        if (!isAtLeftEdge) currentPosition -= 1;

        if (checkTaken()) {
            currentPosition += 1
        }
        draw();
    }

    function moveRight() {
        undraw();
        
        const isAtRightEdge = current.some(index => (currentPosition + index) % width === topRows - 1);

        if (!isAtRightEdge) currentPosition += 1
        
        if (checkTaken()) {
            currentPosition -= 1
        }
        draw();
    }

    function rotate() {
        undraw();
        currentRotation++;
        if (currentRotation == current.length) currentRotation = 0;

        current = theTetrominoes[shape][currentRotation];

        if (checkTaken()) {
            while (checkTaken()) {
                currentPosition -= width;
            }
        }

        checkCross();

        console.log(currentPosition % width);


        draw()
    }



    function drop() {
        undraw();
        while(!checkTaken(width)) {
            currentPosition += width;
        }
        draw()
        current.forEach(index => {
            squares[currentPosition + index].classList.add('taken');
            draw();
        });
        newShape()
    }



    //assign function to keyCodes
    function control(e) {
        if(e.keyCode === 37) {
            moveLeft();
            checkBottom();
        } else if (e.keyCode === 38) {
            rotate();
            // clearInt();
        } else if (e.keyCode === 39) {
            moveRight();
            checkBottom();
        } else if (e.keyCode === 40) {
            moveDown();
        } else if (e.keyCode === 32) {
            drop();
        }
    }

    document.addEventListener('keydown', control);
    

    function startInt() {
        if (interrupts) {
            clearTimeout(interrupts);
            interrupts = null;
            checkBottom();

            setTimeout(() => {timerId = setInterval(lower, 200)}, 400);
        }
    }


    function clearInt() {

        // Clear automatic lower
        clearInterval(timerId);
        timerId = null;

        interrupts = setTimeout(() => {
            if (checkTaken()) {
                current.forEach(index => {
                    squares[currentPosition + index].classList.add('taken');
                    draw();
                });
    
                newShape();
            }
            timerId = setInterval(lower, 200);
            interrupts = null;
        }, 2500);
    }


    function checkBottom() {
        if (checkTaken(width) || checkTaken()) {
            // Clear automatic lower
            clearInterval(timerId);
            timerId = null;

            interrupts = setTimeout(() => {
                if (checkTaken() || checkTaken(width)) {
                    current.forEach(index => {
                        squares[currentPosition + index].classList.add('taken');
                        draw();
                    });
        
                    newShape();
                }
                timerId = setInterval(lower, 200);
                clearTimeout(interrupts);
                interrupts = null;
            }, 2500);
        } else {
            if (!timerId) {
                clearTimeout(interrupts);
                interrupts = null;
                // timerId = setInterval(lower, 200);
            }
        }
    }


    function checkTaken(position = 0) {
        return current.some(index => squares[currentPosition + index + position].classList.contains('taken'));
    }

    //moveDown might work but keep as lower for now

    timerId = setInterval(lower, 200);

    newShape();
    draw();


    function checkCross() {
        const isAtLeftEdge = current.some(index => (currentPosition + index) % width === topRows);
        const isAtRightEdge = current.some(index => (currentPosition + index) % width === topRows - 1);
        const column = currentPosition % width;

        if (isAtRightEdge && isAtLeftEdge) {
            if (column <= 1) {
                currentPosition += column + 1;
            } else {
                currentPosition -= width - column;
            }
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