import { GAME_CONFIG } from './config.js';
import { Snake } from './snake.js';
import { Food } from './food.js';
import { showMenu } from './ui.js';

export class SnakeGame {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.canvas.width = GAME_CONFIG.CANVAS_SIZE + 250;
        this.canvas.height = GAME_CONFIG.CANVAS_SIZE;
        this.direction = 'right';
        this.nextDirection = 'right';
        this.score = 0;
        this.highScore = localStorage.getItem('snakeHighScore') || 0;
        this.gameLoop = null;
        this.eatSound = new Audio('./assets/sound/eat.mp3');

        this.setupGame();
        this.setupEventListeners();
    }

    setupGame() {
        const startX = Math.floor(this.canvas.width / (2 * GAME_CONFIG.TILE_SIZE)) * GAME_CONFIG.TILE_SIZE;
        const startY = Math.floor(this.canvas.height / (2 * GAME_CONFIG.TILE_SIZE)) * GAME_CONFIG.TILE_SIZE;
        
        this.snake = new Snake(startX, startY);
        this.food = new Food();
        this.score = 0;
        this.updateScores();
    }

    updateScores() {
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

    update() {
        this.direction = this.nextDirection;
        const head = { ...this.snake.body[0] };

        switch(this.direction) {
            case 'up': head.y -= GAME_CONFIG.TILE_SIZE; break;
            case 'down': head.y += GAME_CONFIG.TILE_SIZE; break;
            case 'left': head.x -= GAME_CONFIG.TILE_SIZE; break;
            case 'right': head.x += GAME_CONFIG.TILE_SIZE; break;
        }

        if (head.x < 0 || head.x >= this.canvas.width || 
            head.y < 0 || head.y >= this.canvas.height) {
            this.gameOver();
            return;
        }

        for (let segment of this.snake.body) {
            if (head.x === segment.x && head.y === segment.y) {
                this.gameOver();
                return;
            }
        }

        this.snake.body.unshift(head);

        if (head.x === this.food.position.x && head.y === this.food.position.y) {
            this.score += 1;
            this.updateScores();
            this.food.generatePosition();
            this.eatSound.play();
        } else {
            this.snake.body.pop();
        }
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.snake.draw(this.ctx);
        this.food.draw(this.ctx);
    }

    gameOver() {
        clearInterval(this.gameLoop);
        if (this.score > this.highScore) {
            this.highScore = this.score;
            localStorage.setItem('snakeHighScore', this.highScore);
            this.updateScores();
        }
        showMenu();
    }

    start() {
        this.setupGame();
        this.gameSpeed = GAME_CONFIG.INITIAL_SPEED;
        this.gameLoop = setInterval(() => {
            this.update();
            this.draw();
            
            // Increase speed every 5 points
            if (this.score > 0 && this.score % 5 === 0) {
                clearInterval(this.gameLoop);
                this.gameSpeed = Math.max(50, this.gameSpeed - 10); // Limit minimum speed
                this.gameLoop = setInterval(() => {
                    this.update();
                    this.draw();
                }, this.gameSpeed);
            }
        }, this.gameSpeed);
    }
}