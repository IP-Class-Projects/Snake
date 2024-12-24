class SnakeGame {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.canvas.width = 600;
        this.canvas.height = 600;
        this.tileSize = 20;
        this.snake = [];
        this.food = {};
        this.direction = 'right';
        this.nextDirection = 'right';
        this.score = 0;
        this.highScore = localStorage.getItem('snakeHighScore') || 0;
        this.gameLoop = null;
        this.setupGame();
        this.setupEventListeners();
    }

    setupGame() {
        // Initialize snake in the middle
        const startX = Math.floor(this.canvas.width / (2 * this.tileSize)) * this.tileSize;
        const startY = Math.floor(this.canvas.height / (2 * this.tileSize)) * this.tileSize;
        this.snake = [
            { x: startX, y: startY },
            { x: startX - this.tileSize, y: startY },
            { x: startX - this.tileSize * 2, y: startY }
        ];
        this.generateFood();
        this.score = 0;
        document.getElementById('score').textContent = this.score;
        document.getElementById('highScore').textContent = this.highScore;
    }

    setupEventListeners() {
        document.addEventListener('keydown', (e) => {
            switch(e.key) {
                case 'ArrowUp':
                    if (this.direction !== 'down') this.nextDirection = 'up';
                    break;
                case 'ArrowDown':
                    if (this.direction !== 'up') this.nextDirection = 'down';
                    break;
                case 'ArrowLeft':
                    if (this.direction !== 'right') this.nextDirection = 'left';
                    break;
                case 'ArrowRight':
                    if (this.direction !== 'left') this.nextDirection = 'right';
                    break;
            }
        });
    }

    generateFood() {
        const x = Math.floor(Math.random() * (this.canvas.width / this.tileSize)) * this.tileSize;
        const y = Math.floor(Math.random() * (this.canvas.height / this.tileSize)) * this.tileSize;
        this.food = { x, y };
    }

    update() {
        this.direction = this.nextDirection;
        const head = { x: this.snake[0].x, y: this.snake[0].y };

        switch(this.direction) {
            case 'up': head.y -= this.tileSize; break;
            case 'down': head.y += this.tileSize; break;
            case 'left': head.x -= this.tileSize; break;
            case 'right': head.x += this.tileSize; break;
        }

        // Check collision with walls
        if (head.x < 0 || head.x >= this.canvas.width || 
            head.y < 0 || head.y >= this.canvas.height) {
            this.gameOver();
            return;
        }

        // Check collision with self
        for (let i = 0; i < this.snake.length; i++) {
            if (head.x === this.snake[i].x && head.y === this.snake[i].y) {
                this.gameOver();
                return;
            }
        }

        this.snake.unshift(head);

        // Check if food is eaten
        if (head.x === this.food.x && head.y === this.food.y) {
            this.score += 10;
            document.getElementById('score').textContent = this.score;
            this.generateFood();
        } else {
            this.snake.pop();
        }
    }

    draw() {
        // Clear canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.snake.draw(this.ctx);
        this.food.draw(this.ctx);

        // Draw snake
        this.snake.forEach((segment, index) => {
            const gradient = this.ctx.createRadialGradient(
                segment.x + this.tileSize/2, 
                segment.y + this.tileSize/2, 
                0,
                segment.x + this.tileSize/2, 
                segment.y + this.tileSize/2, 
                this.tileSize
            );
            
            if (index === 0) {
                // Head
                gradient.addColorStop(0, '#6fff9f');
                gradient.addColorStop(1, '#4ecca3');
            } else {
                // Body
                gradient.addColorStop(0, '#4ecca3');
                gradient.addColorStop(1, '#45b08c');
            }
            
            this.ctx.fillStyle = gradient;
            this.ctx.fillRect(segment.x, segment.y, this.tileSize, this.tileSize);
            
            // Add shine effect
            this.ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
            this.ctx.fillRect(segment.x, segment.y, this.tileSize/2, this.tileSize/2);
        });

        // Draw food with glow effect
        this.ctx.shadowColor = '#ff6b6b';
        this.ctx.shadowBlur = 15;
        this.ctx.fillStyle = '#ff6b6b';
        this.ctx.beginPath();
        this.ctx.arc(
            this.food.x + this.tileSize/2,
            this.food.y + this.tileSize/2,
            this.tileSize/2,
            0,
            Math.PI * 2
        );
        this.ctx.fill();
        this.ctx.shadowBlur = 0;
    }

    gameOver() {
        clearInterval(this.gameLoop);
        if (this.score > this.highScore) {
            this.highScore = this.score;
            localStorage.setItem('snakeHighScore', this.highScore);
            document.getElementById('highScore').textContent = this.highScore;
        }
        showMenu();
    }

    start() {
        this.setupGame();
        this.gameLoop = setInterval(() => {
            this.update();
            this.draw();
        }, 100);
    }
}

// UI Management
let game = null;

function showMenu() {
    document.getElementById('menu').classList.remove('hidden');
    document.getElementById('gameContainer').classList.add('hidden');
}

function showGame() {
    document.getElementById('menu').classList.add('hidden');
    document.getElementById('gameContainer').classList.remove('hidden');
}

// Event Listeners
document.getElementById('newGame').addEventListener('click', () => {
    showGame();
    game = new SnakeGame();
    game.start();
});

document.getElementById('quitGame').addEventListener('click', () => {
    window.close();
});

document.getElementById('backToMenu').addEventListener('click', () => {
    if (game) {
        clearInterval(game.gameLoop);
    }
    showMenu();
});

// Initialize high score display
document.getElementById('highScore').textContent = localStorage.getItem('snakeHighScore') || 0;