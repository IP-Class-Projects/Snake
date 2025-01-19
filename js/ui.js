import { SnakeGame } from './game.js';

let game = null;

export function showMenu() {
    document.getElementById('menu').classList.remove('hidden');
    document.getElementById('gameContainer').classList.add('hidden');
}

export function showGame() {
    document.getElementById('menu').classList.add('hidden');
    document.getElementById('gameContainer').classList.remove('hidden');
}

export function initializeUI() {
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
            game.stop();
        }
        showMenu();
    });

    document.getElementById('highScore').textContent = localStorage.getItem('snakeHighScore') || 0;
}