const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreDisplay = document.getElementById('score');
const gameOverDisplay = document.getElementById('gameOver');

const gridSize = 20; // Tamanho de cada bloco
const canvasSize = 400; // Tamanho do canvas
let snake = [{x: 160, y: 160}]; // Posições iniciais da cobrinha
let food = spawnFood();
let direction = {x: gridSize, y: 0}; // Direção inicial (para a direita)
let score = 0;
let gameSpeed = 100; // Velocidade inicial do jogo
let gameInterval; // Intervalo de tempo para o loop do jogo
let isPaused = false; // Controle de pausa

document.addEventListener('keydown', handleKeyPress);

function startGame() {
    gameInterval = setInterval(gameLoop, gameSpeed);
    gameOverDisplay.style.display = 'none';
}

function gameLoop() {
    if (isPaused) return;

    clearCanvas();
    moveSnake();
    checkCollisions();
    drawFood();
    drawSnake();
    updateScore();
    adjustSpeed();
}

function clearCanvas() {
    ctx.clearRect(0, 0, canvasSize, canvasSize);
}

function drawSnake() {
    snake.forEach(segment => {
        ctx.fillStyle = 'green';
        ctx.fillRect(segment.x, segment.y, gridSize, gridSize);
    });
}

function moveSnake() {
    const head = {x: snake[0].x + direction.x, y: snake[0].y + direction.y};
    snake.unshift(head);

    if (head.x === food.x && head.y === food.y) {
        score++;
        food = spawnFood();
    } else {
        snake.pop();
    }
}

function checkCollisions() {
    const head = snake[0];

    // Verificar colisão com as bordas
    if (head.x < 0 || head.x >= canvasSize || head.y < 0 || head.y >= canvasSize) {
        endGame();
    }

    // Verificar colisão com o próprio corpo
    for (let i = 1; i < snake.length; i++) {
        if (snake[i].x === head.x && snake[i].y === head.y) {
            endGame();
        }
    }
}

function spawnFood() {
    const x = Math.floor(Math.random() * (canvasSize / gridSize)) * gridSize;
    const y = Math.floor(Math.random() * (canvasSize / gridSize)) * gridSize;
    return {x, y};
}

function drawFood() {
    ctx.fillStyle = 'red';
    ctx.fillRect(food.x, food.y, gridSize, gridSize);
}

function updateScore() {
    scoreDisplay.textContent = `Pontos: ${score}`;
}

function adjustSpeed() {
    // Aumentar a velocidade a cada 5 pontos
    if (score % 5 === 0 && score > 0) {
        gameSpeed = Math.max(50, 100 - Math.floor(score / 5) * 10); // Acelera o jogo
        clearInterval(gameInterval);
        gameInterval = setInterval(gameLoop, gameSpeed);
    }
}

function handleKeyPress(event) {
    switch(event.key) {
        case 'ArrowUp':
            if (direction.y === 0) {
                direction = {x: 0, y: -gridSize};
            }
            break;
        case 'ArrowDown':
            if (direction.y === 0) {
                direction = {x: 0, y: gridSize};
            }
            break;
        case 'ArrowLeft':
            if (direction.x === 0) {
                direction = {x: -gridSize, y: 0};
            }
            break;
        case 'ArrowRight':
            if (direction.x === 0) {
                direction = {x: gridSize, y: 0};
            }
            break;
        case 'p': // Pausar o jogo
            togglePause();
            break;
    }
}

function togglePause() {
    isPaused = !isPaused;
    if (isPaused) {
        clearInterval(gameInterval);
    } else {
        gameInterval = setInterval(gameLoop, gameSpeed);
    }
}

function endGame() {
    clearInterval(gameInterval);
    gameOverDisplay.style.display = 'block';
}

// Começar o jogo
startGame();
