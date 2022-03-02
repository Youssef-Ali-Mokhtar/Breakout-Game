const grid = document.querySelector('.grid');
const BLOCK_WIDTH = 100;
const BLOCK_HEIGHT = 20;
let score = 0;
let xDirection = -2;
let yDirection = 2;
let timerId;
const scoreDisplay = document.querySelector("#score");

class Block{
    constructor(xAxis, yAxis){
        this.bottomLeft = [xAxis, yAxis];
        this.bottomRight = [xAxis + BLOCK_WIDTH, yAxis];
        this.topLeft = [xAxis, yAxis + BLOCK_HEIGHT];
        this.topRight = [xAxis + BLOCK_WIDTH, yAxis + BLOCK_HEIGHT];
    }
}

//add blocks
const blocks = [
    new Block(10, 270),
    new Block(120, 270),
    new Block(230, 270),
    new Block(340, 270),
    new Block(450, 270),
    new Block(10, 240),
    new Block(120, 240),
    new Block(230, 240),
    new Block(340, 240),
    new Block(450, 240),
    new Block(10, 210),
    new Block(120, 210),
    new Block(230, 210),
    new Block(340, 210),
    new Block(450, 210),
];

function addBlocks(){
    for(let i = 0; i < blocks.length; i++){
        const block = document.createElement('div');
        block.classList.add('block');
        block.style.left = blocks[i].bottomLeft[0]+'px';
        block.style.bottom = blocks[i].bottomLeft[1]+'px';
        grid.appendChild(block);
    }
}

addBlocks();


//draw user
function drawUser(){
    user.style.left = currentPosition[0]+'px';
    user.style.bottom = currentPosition[1]+'px';
}

//add user
const userStart = [230,10];
let currentPosition = userStart;
const boardWidth = 560;

const user = document.createElement('div');
user.classList.add('user');
drawUser();
grid.appendChild(user);


//move user
function moveUser(e){
    switch(e.key){
        case 'ArrowLeft':
            if(currentPosition[0] > 0){
                currentPosition[0]-=10;
                drawUser();
            }
            break;
        case 'ArrowRight':
            if(currentPosition[0] < boardWidth - BLOCK_WIDTH){
                currentPosition[0]+=10;
                drawUser();
            }
            break;
    }
}

document.addEventListener("keydown", moveUser);

//draw ball
function drawBall(){
    ball.style.left = ballCurrentPosition[0]+'px';
    ball.style.bottom = ballCurrentPosition[1]+'px';
}

//add ball
const ballStart = [270, 40];
const ballDiameter = 20;
let ballCurrentPosition = ballStart;
const ball = document.createElement('div');
ball.classList.add("ball");
drawBall();
grid.appendChild(ball);




//move ball
function moveBall(){
    ballCurrentPosition[0] += xDirection;
    ballCurrentPosition[1] += yDirection;
    drawBall();
    checkForCollisions();
}

timerId = setInterval(moveBall, 20);

function increaseScore(){
    score++;
    scoreDisplay.innerHTML = score;
}

function won(){
    scoreDisplay.innerHTML = "You won";
}

function removeBall(){
    ball.classList.remove('ball');
}

function lost(){
    scoreDisplay.innerHTML = "You lost";
}

function removeBlock(i){ 
    const allBlocks = Array.from(document.querySelectorAll('.block'));
    allBlocks[i].classList.remove('block');
    blocks.splice(i,1);
}

//Check for collisions
function checkForCollisions(){

    //Check for block collisions
    for(let i = 0; i < blocks.length; i++){
        if(
            (ballCurrentPosition[0] > blocks[i].bottomLeft[0]) &&
            (ballCurrentPosition[0] < blocks[i].bottomRight[0]) &&
            ((ballCurrentPosition[1] + ballDiameter) > blocks[i].bottomLeft[1]) &&
            (ballCurrentPosition[1] < blocks[i].topLeft[1])
        ) {
                increaseScore();
                removeBlock(i);
                changeVerticalDirection();
                if(blocks.length === 0){
                    won();
                    removeBall();
                    clearInterval(timerId);
                }       
        }
    }

    //Check for user collisions
    if((ballCurrentPosition[1] === currentPosition[1] + BLOCK_HEIGHT) &&
       (ballCurrentPosition[0] >= currentPosition[0] - ballDiameter/2) &&
       (ballCurrentPosition[0] <= currentPosition[0] + BLOCK_WIDTH - ballDiameter/2)){
        changeVerticalDirection();
    }else if((ballCurrentPosition[1] < currentPosition[1] + BLOCK_HEIGHT) &&
    (ballCurrentPosition[0] >= currentPosition[0] - ballDiameter/2) &&
    (ballCurrentPosition[0] <= currentPosition[0] + BLOCK_WIDTH - ballDiameter/2)){
        changeHorizontalDirection();
    }

    //check for wall collisions
    if(ballCurrentPosition[1] >= (300-ballDiameter)){ //ball hits the ceiling
        changeVerticalDirection();

    }else if(ballCurrentPosition[0] >= (560-ballDiameter)){ //ball hits the right wall
        changeHorizontalDirection();

    }else if(ballCurrentPosition[1] <= 0){ //ball hits the floor
        clearInterval(timerId);
        lost();
        document.removeEventListener('keydown', moveUser);
    }else if(ballCurrentPosition[0] <= 0){ //ball hits the left wall
        changeHorizontalDirection();
    }
}

function changeVerticalDirection(){
        yDirection *= -1;
}

function changeHorizontalDirection(){
        xDirection *= -1;
}