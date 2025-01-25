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
        const difficulty = document.getElementById('difficulty').value;
        showGame();
        game = new SnakeGame(difficulty);
        game.start();
    });

    document.getElementById('quitGame').addEventListener('click', () => {
        const confirmQuit = confirm('Are you sure you want to quit the game?');
        if (confirmQuit) {
            window.close();
        }
    });

    document.getElementById('backToMenu').addEventListener('click', () => {
        showMenu();
    });

    document.getElementById('highScore').textContent = localStorage.getItem('snakeHighScore') || 0;
}