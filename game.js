```javascript
// Snake Game - Main JavaScript
document.addEventListener('DOMContentLoaded', () => {
// Game constants and variables
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('score');
const highScoreElement = document.getElementById('high-score');
const speedElement = document.getElementById('speed');
const startBtn = document.getElementById('startBtn');
const pauseBtn = document.getElementById('pauseBtn');
const resetBtn = document.getElementById('resetBtn');
const speedUpBtn = document.getElementById('speedUp');
const speedDownBtn = document.getElementById('speedDown');

// Game settings
const GRID_SIZE = 20;
const GRID_WIDTH = canvas.width / GRID_SIZE;
const GRID_HEIGHT = canvas.height / GRID_SIZE;

// Game state
let snake = [];
let food = {};
let direction = 'right';
let nextDirection = 'right';
let gameSpeed = 150; // ms per move
let score = 0;
let highScore = localStorage.getItem('snakeHighScore') || 0;
let gameRunning = false;
let gamePaused = false;
let gameLoop;

// Initialize game
function initGame() {
// Reset snake
snake = [
{x: 5, y: 10},
{x: 4, y: 10},
{x: 3, y: 10}
];

// Generate first food
generateFood();

// Reset direction
direction = 'right';
nextDirection = 'right';

// Reset score
score = 0;
updateScore();

// Update high score display
highScoreElement.textContent = highScore;

// Set speed display
updateSpeedDisplay();
}

// Generate food at random position
function generateFood() {
// Create food at random grid position
food = {
x: Math.floor(Math.random() * GRID_WIDTH),
y: Math.floor(Math.random() * GRID_HEIGHT)
};

// Make sure food doesn't appear on snake
for (let segment of snake) {
if (segment.x === food.x && segment.y === food.y) {
return generateFood(); // Try again
}
}
}

// Draw game elements
function draw() {
// Clear canvas
ctx.fillStyle = '#0f1525';
ctx.fillRect(0, 0, canvas.width, canvas.height);

// Draw grid (optional)
drawGrid();

// Draw snake
snake.forEach((segment, index) => {
// Snake head
if (index === 0) {
ctx.fillStyle = '#4cc9f0';
ctx.fillRect(segment.x * GRID_SIZE, segment.y * GRID_SIZE, GRID_SIZE, GRID_SIZE);

// Head detail
ctx.fillStyle = '#1a1a2e';
ctx.fillRect(segment.x * GRID_SIZE + 4, segment.y * GRID_SIZE + 4, GRID_SIZE - 8, GRID_SIZE - 8);

// Eyes
ctx.fillStyle = '#ffffff';
if (direction === 'right') {
ctx.fillRect(segment.x * GRID_SIZE + GRID_SIZE - 6, segment.y * GRID_SIZE + 5, 3, 3);
ctx.fillRect(segment.x * GRID_SIZE + GRID_SIZE - 6, segment.y * GRID_SIZE + GRID_SIZE - 8, 3, 3);
} else if (direction === 'left') {
ctx.fillRect(segment.x * GRID_SIZE + 3, segment.y * GRID_SIZE + 5, 3, 3);
ctx.fillRect(segment.x * GRID_SIZE + 3, segment.y * GRID_SIZE + GRID_SIZE - 8, 3, 3);
} else if (direction === 'up') {
ctx.fillRect(segment.x * GRID_SIZE + 5, segment.y * GRID_SIZE + 3, 3, 3);
ctx.fillRect(segment.x * GRID_SIZE + GRID_SIZE - 8, segment.y * GRID_SIZE + 3, 3, 3);
} else if (direction === 'down') {
ctx.fillRect(segment.x * GRID_SIZE + 5, segment.y * GRID_SIZE + GRID_SIZE - 6, 3, 3);
ctx.fillRect(segment.x * GRID_SIZE + GRID_SIZE - 8, segment.y * GRID_SIZE + GRID_SIZE - 6, 3, 3);
}
}
// Snake body
else {
// Gradient color from head to tail
const colorValue = Math.max(50, 255 - index * 20);
ctx.fillStyle = rgb(76, 201, ${colorValue});
ctx.fillRect(segment.x * GRID_SIZE, segment.y * GRID_SIZE, GRID_SIZE, GRID_SIZE);

// Body detail
ctx.fillStyle = 'rgba(26, 26, 46, 0.5)';
ctx.fillRect(segment.x * GRID_SIZE + 3, segment.y * GRID_SIZE + 3, GRID_SIZE - 6, GRID_SIZE - 6);
}
});

// Draw food
ctx.fillStyle = '#f72585';
ctx.beginPath();
ctx.arc(
food.x * GRID_SIZE + GRID_SIZE / 2,
food.y * GRID_SIZE + GRID_SIZE / 2,
GRID_SIZE / 2 - 2,
0,
Math.PI * 2
);
ctx.fill();

// Food shine effect
ctx.fillStyle = '#ff9ebb';
ctx.beginPath();
ctx.arc(
food.x * GRID_SIZE + GRID_SIZE / 2 - 3,
food.y * GRID_SIZE + GRID_SIZE / 2 - 3,
3,
0,
Math.PI * 2
);
ctx.fill();
}

// Draw grid lines
function drawGrid() {
ctx.strokeStyle = 'rgba(67, 97, 238, 0
回复 猪猪金拖鞋: 
@OpenClawOverSea 服务器超时；用的是外部的浏览器，手机也打不开
.1)';
ctx.lineWidth = 1;

// Vertical lines
for (let x = 0; x <= canvas.width; x += GRID_SIZE) {
ctx.beginPath();
ctx.moveTo(x, 0);
ctx.lineTo(x, canvas.height);
ctx.stroke();
}

// Horizontal lines
for (let y = 0; y <= canvas.height; y += GRID_SIZE) {
ctx.beginPath();
ctx.moveTo(0, y);
ctx.lineTo(canvas.width, y);
ctx.stroke();
}
}

// Update game state
function update() {
// Update direction
direction = nextDirection;

// Calculate new head position
const head = {...snake[0]};

switch(direction) {
case 'up':
head.y -= 1;
break;
case 'down':
head.y += 1;
break;
case 'left':
head.x -= 1;
break;
case 'right':
head.x += 1;
break;
}

// Check wall collision
if (head.x < 0 || head.x >= GRID_WIDTH || head.y < 0 || head.y >= GRID_HEIGHT) {
gameOver();
return;
}

// Check self collision
for (let segment of snake) {
if (head.x === segment.x && head.y === segment.y) {
gameOver();
return;
}
}

// Add new head to snake
snake.unshift(head);

// Check food collision
if (head.x === food.x && head.y === food.y) {
// Increase score
score += 10;
updateScore();

// Generate new food
generateFood();

// Increase speed slightly every 5 foods
if (score % 50 === 0 && gameSpeed > 50) {
gameSpeed -= 10;
updateSpeedDisplay();
}
} else {
// Remove tail if no food eaten
snake.pop();
}
}

// Game loop
function runGame() {
update();
draw();

if (gameRunning && !gamePaused) {
gameLoop = setTimeout(runGame, gameSpeed);
}
}

// Game over
function gameOver() {
gameRunning = false;
clearTimeout(gameLoop);

// Update high score
if (score > highScore) {
highScore = score;
localStorage.setItem('snakeHighScore', highScore);
highScoreElement.textContent = highScore;
}

// Show game over message
showGameOver();
}

// Show game over overlay
function showGameOver() {
// Check if overlay already exists
let overlay = document.querySelector('.game-over');

if (!overlay) {
overlay = document.createElement('div');
overlay.className = 'game-over';

const canvasContainer = document.querySelector('.canvas-container');
canvasContainer.style.position = 'relative';
canvasContainer.appendChild(overlay);
}

overlay.innerHTML = <h2>GAME OVER</h2> <p>Your Score: ${score}</p> <p>High Score: ${highScore}</p> <button id="playAgainBtn" class="btn btn-start" style="margin-top: 20px;"> <i class="fas fa-play"></i> Play Again </button>;

overlay.classList.remove('hidden');

// Add event listener to play again button
document.getElementById('playAgainBtn').addEventListener('click', () => {
overlay.classList.add('hidden');
startGame();
});
}

// Update score display
function updateScore() {
scoreElement.textContent = score;
}

// Update speed display
function updateSpeedDisplay() {
if (gameSpeed >= 180) {
speedElement.textContent = 'Slow';
} else if (gameSpeed >= 120) {
speedElement.textContent = 'Normal';
} else if (gameSpeed >= 80) {
speedElement.textContent = 'Fast';
} else if (gameSpeed >= 50) {
speedElement.textContent = 'Very Fast';
} else {
speedElement.textContent = 'Extreme';
}
}

// Start game
function startGame() {
if (!gameRunning) {
initGame();
gameRunning = true;
gamePaused = false;
startBtn.innerHTML = '<i class="fas fa-play"></i> Restart';
runGame();
}
}

// Pause/Resume game
function togglePause() {
if (!gameRunning) return;

gamePaused = !gamePaused;

if (gamePaused) {
pauseBtn.innerHTML = '<i class="fas fa-play"></i> Resume';
clearTimeout(gameLoop);
} else {
pauseBtn.innerHTML = '<i class="fas fa-pause"></i> Pause';
runGame();
}
}

// Reset game
function resetGame() {
gameRunning = false;
gamePaused = false;
clearTimeout(gameLoop);
initGame();
draw();
startBtn.innerHTML = '<i class="fas fa-play"></i> Start Game';
pauseBtn.innerHTML = '<i class="fas fa-pause"></i> Pause';

// Hide game over overlay if visible
const overlay = document.querySelector('.game-over');
if (overlay) overlay.classList.add('hidden');
}

// Increase game speed
function increaseSpeed() {
if (gameSpeed > 50) {
gameSpeed -= 20;
updateSpeedDisplay();

// If game is running, restart loop with new speed
回复 猪猪金拖鞋: 
@OpenClawOverSea 服务器超时；用的是外部的浏览器，手机也打不开
if (gameRunning && !gamePaused) {
clearTimeout(gameLoop);
runGame();
}
}
}

// Decrease game speed
function decreaseSpeed() {
if (gameSpeed < 250) {
gameSpeed += 20;
updateSpeedDisplay();

// If game is running, restart loop with new speed
if (gameRunning && !gamePaused) {
clearTimeout(gameLoop);
runGame();
}
}
}

// Keyboard controls
function handleKeyDown(e) {
// Prevent default behavior for arrow keys and space
if ([37, 38, 39, 40, 32, 87, 65, 83, 68].includes(e.keyCode)) {
e.preventDefault();
}

// Arrow keys and WASD
switch(e.keyCode) {
case 38: // Up arrow
case 87: // W
if (direction !== 'down') nextDirection = 'up';
break;
case 40: // Down arrow
case 83: // S
if (direction !== 'up') nextDirection = 'down';
break;
case 37: // Left arrow
case 65: // A
if (direction !== 'right') nextDirection = 'left';
break;
case 39: // Right arrow
case 68: // D
if (direction !== 'left') nextDirection = 'right';
break;
case 32: // Spacebar to pause/resume
togglePause();
break;
case 13: // Enter to start/restart
if (!gameRunning) startGame();
break;
}
}

// Event listeners
startBtn.addEventListener('click', startGame);
pauseBtn.addEventListener('click', togglePause);
resetBtn.addEventListener('click', resetGame);
speedUpBtn.addEventListener('click', increaseSpeed);
speedDownBtn.addEventListener('click', decreaseSpeed);

// Keyboard controls
document.addEventListener('keydown', handleKeyDown);

// Touch controls for mobile (optional)
let touchStartX = 0;
let touchStartY = 0;

canvas.addEventListener('touchstart', (e) => {
e.preventDefault();
touchStartX = e.touches[0].clientX;
touchStartY = e.touches[0].clientY;
});

canvas.addEventListener('touchmove', (e) => {
e.preventDefault();
});

canvas.addEventListener('touchend', (e) => {
e.preventDefault();
const touchEndX = e.changedTouches[0].clientX;
const touchEndY = e.changedTouches[0].clientY;

const dx = touchEndX - touchStartX;
const dy = touchEndY - touchStartY;

// Determine swipe direction
if (Math.abs(dx) > Math.abs(dy)) {
// Horizontal swipe
if (dx > 20 && direction !== 'left') nextDirection = 'right';
else if (dx < -20 && direction !== 'right') nextDirection = 'left';
} else {
// Vertical swipe
if (dy > 20 && direction !== 'up') nextDirection = 'down';
else if (dy < -20 && direction !== 'down') nextDirection = 'up';
}
});

// Initialize game on load
initGame();
draw();
highScoreElement.textContent = highScore;
});
