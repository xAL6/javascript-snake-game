// 初始化畫布和繪圖上下文
const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");

const unit = 20;
const row = canvas.height / unit;
const column = canvas.width / unit;

let snake = [];

// 建立初始蛇身
function createSnake() {
    snake = [
        { x: 80, y: 0 },
        { x: 60, y: 0 },
        { x: 40, y: 0 },
        { x: 20, y: 0 }
    ];
}
createSnake();

// 水果類別
class Fruit {
    constructor() {
        this.pickALocation();
    }

    drawFruit() {
        ctx.fillStyle = "yellow";
        ctx.fillRect(this.x, this.y, unit, unit);
    }

    pickALocation() {
        let overlapping;
        do {
            overlapping = false;
            this.x = Math.floor(Math.random() * column) * unit;
            this.y = Math.floor(Math.random() * row) * unit;
            
            // 檢查新位置是否與蛇身重疊
            for (let segment of snake) {
                if (segment.x === this.x && segment.y === this.y) {
                    overlapping = true;
                    break;
                }
            }
        } while (overlapping);
    }
}

let myFruit = new Fruit();
let direction = "Right";

function changeDirection(e) {
    switch (e.key) {
        case "ArrowRight":
            if (direction !== "Left") direction = "Right";
            break;
        case "ArrowLeft":
            if (direction !== "Right") direction = "Left";
            break;
        case "ArrowUp":
            if (direction !== "Down") direction = "Up";
            break;
        case "ArrowDown":
            if (direction !== "Up") direction = "Down";
            break;
    }
    window.removeEventListener("keydown", changeDirection);
}

// 加載和設置最高分
let highestScore;
loadHighScore();

let score = 0;
updateScoreDisplay();

function loadHighScore() {
    highestScore = localStorage.getItem("highestScore") || 0;
}

function setHighestScore(score) {
    if (score > highestScore) {
        highestScore = score;
        localStorage.setItem("highestScore", highestScore);
    }
}

function updateScoreDisplay() {
    document.getElementById("myScore").innerText = "遊戲分數: " + score;
    document.getElementById("myScore2").innerText = "最高分數: " + highestScore;
}

// 主遊戲循環
function draw() {
    // 檢查蛇是否咬到自己
    for (let i = 1; i < snake.length; i++) {
        if (snake[0].x === snake[i].x && snake[0].y === snake[i].y) {
            clearInterval(myGame);
            alert("遊戲結束");
            return;
        }
    }

    // 繪製背景
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 繪製水果
    myFruit.drawFruit();

    // 繪製蛇
    for (let i = 0; i < snake.length; i++) {
        ctx.fillStyle = (i === 0) ? "lightgreen" : "lightblue";
        ctx.strokeStyle = "white";
        ctx.fillRect(snake[i].x, snake[i].y, unit, unit);
        ctx.strokeRect(snake[i].x, snake[i].y, unit, unit);
    }

    // 移動蛇身
    let snakeX = snake[0].x;
    let snakeY = snake[0].y;

    switch (direction) {
        case "Right":
            snakeX += unit;
            break;
        case "Left":
            snakeX -= unit;
            break;
        case "Up":
            snakeY -= unit;
            break;
        case "Down":
            snakeY += unit;
            break;
    }

    // 檢查蛇是否吃到水果
    if (snakeX === myFruit.x && snakeY === myFruit.y) {
        myFruit.pickALocation();
        score++;
        setHighestScore(score);
        updateScoreDisplay();
    } else {
        snake.pop();
    }

    // 新增新蛇頭
    let newHead = { x: snakeX, y: snakeY };
    snake.unshift(newHead);

    // 當蛇到達畫布邊界時，讓蛇從另一邊出現
    if (snake[0].x >= canvas.width) snake[0].x = 0;
    if (snake[0].y >= canvas.height) snake[0].y = 0;
    if (snake[0].x < 0) snake[0].x = canvas.width - unit;
    if (snake[0].y < 0) snake[0].y = canvas.height - unit;

    window.addEventListener("keydown", changeDirection);
}

let myGame = setInterval(draw, 100);