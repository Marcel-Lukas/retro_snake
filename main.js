let canvas = document.getElementById('canvas');
let ctx = canvas.getContext('2d');
let rows = 25;
let cols = 25;
let snake = [{
    x: 19,
    y: 3
}];

let food;
let foodImage = new Image();
foodImage.src = 'src/apfel.png';
let snakeHeadImage = new Image();
snakeHeadImage.src = 'src/head.png';

let cellWidth = canvas.width / cols;
let cellHeight = canvas.height / rows;
let direction = 'LEFT';
let foodCollected = false;
let score = 0;
let time = 0;
let highScore = 0;
let gamePaused = false;

placeFood();

let gameInterval = setInterval(gameLoop, 200);
let timeInterval = setInterval(updateTime, 1000);
document.addEventListener('keydown', keyDown);
document.querySelector('.pause').addEventListener('click', togglePause);

draw();
function draw() {
    ctx.fillStyle = 'rgb(15, 90, 30)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'rgb(91, 123, 249)';

    ctx.save();
    ctx.translate(snake[0].x * cellWidth + cellWidth / 2, snake[0].y * cellHeight + cellHeight / 2);
    if (direction === 'UP') {
        ctx.rotate(0);
    } else if (direction === 'DOWN') {
        ctx.rotate(Math.PI);
    } else if (direction === 'LEFT') {
        ctx.rotate(-Math.PI / 2);
    } else if (direction === 'RIGHT') {
        ctx.rotate(Math.PI / 2);
    }
    ctx.drawImage(snakeHeadImage, -cellWidth / 2, -cellHeight / 2, cellWidth - 1, cellHeight - 1);
    ctx.restore();
    
    snake.slice(1).forEach(part => add(part.x, part.y));

    ctx.drawImage(foodImage, food.x * cellWidth, food.y * cellHeight, cellWidth - 1, cellHeight - 1);
    requestAnimationFrame(draw);
}

function testGameOver() {
    let firstPart = snake[0];
    let otherParts = snake.slice(1);
    let duplicatePart = otherParts.find(part => part.x == firstPart.x && part.y == firstPart.y);

    if (snake[0].x < 0 ||
        snake[0].x > cols - 1 ||
        snake[0].y < 0 ||
        snake[0].y > rows - 1 ||
        duplicatePart
    ) {
        playSound('src/fail.ogg');
        placeFood();
        snake = [{
            x: 19,
            y: 3
        }];
        direction = 'LEFT';
        score = 0;
        updateScore();
        time = 0;
        updateTime();
    }
}

function placeFood() {
    let randomX = Math.floor(Math.random() * cols);
    let randomY = Math.floor(Math.random() * rows);

    food = {
        x: randomX,
        y: randomY
    };
}

function add(x, y) {
    ctx.fillRect(x * cellWidth, y * cellHeight, cellWidth - 1, cellHeight - 1);
}

function shiftSnake() {
    for (let i = snake.length - 1; i > 0; i--) {
        const part = snake[i];
        const lastPart = snake[i - 1];
        part.x = lastPart.x;
        part.y = lastPart.y;
    }
}

function gameLoop() {
    if (gamePaused) return;
    testGameOver();
    if (foodCollected) {
        snake = [{
            x: snake[0].x,
            y: snake[0].y
        }, ...snake];

        foodCollected = false;
        score++;
        updateScore();
    }

    shiftSnake();

    if (direction == 'LEFT') {
        snake[0].x--;
    }

    if (direction == 'RIGHT') {
        snake[0].x++;
    }

    if (direction == 'UP') {
        snake[0].y--;
    }

    if (direction == 'DOWN') {
        snake[0].y++;
    }

    if (snake[0].x == food.x &&
        snake[0].y == food.y) {
        foodCollected = true;
        playSound('src/schmatz.ogg');
        placeFood();
    }
}

function keyDown(e) {
    if (e.keyCode == 37 && direction !== 'RIGHT') {
        direction = 'LEFT';
    }
    if (e.keyCode == 38 && direction !== 'DOWN') {
        direction = 'UP';
    }
    if (e.keyCode == 39 && direction !== 'LEFT') {
        direction = 'RIGHT';
    }
    if (e.keyCode == 40 && direction !== 'UP') {
        direction = 'DOWN';
    }
}

function togglePause() {
    gamePaused = !gamePaused;
    if (!gamePaused) {
        gameInterval = setInterval(gameLoop, 200);
        timeInterval = setInterval(updateTime, 1000);
    } else {
        clearInterval(gameInterval);
        clearInterval(timeInterval);
    }
}

function updateScore() {
    document.getElementById('score').textContent = score;
    let newHighScore = score * time;
    if (newHighScore > highScore) {
        highScore = newHighScore;
        document.getElementById('highs-core').textContent = highScore;
    }
}

function updateTime() {
    if (gamePaused) return;
    document.getElementById('time').textContent = time;
    time++;
}

function isSoundMuted() {
    return document.getElementById('checkbox').checked;
}

function playSound(file) {
    if (isSoundMuted()) return;
    let audio = new Audio(file);
    audio.play();
}

