import { GAME_CONFIG } from './config.js';

export class Food {
    constructor() {
        this.position = { x: 0, y: 0 };
        this.generatePosition();
    }

    generatePosition() {
        this.position.x = Math.floor(Math.random() * (GAME_CONFIG.CANVAS_SIZE / GAME_CONFIG.TILE_SIZE)) * GAME_CONFIG.TILE_SIZE;
        this.position.y = Math.floor(Math.random() * (GAME_CONFIG.CANVAS_SIZE / GAME_CONFIG.TILE_SIZE)) * GAME_CONFIG.TILE_SIZE;
    }

    draw(ctx) {
        // Apple body
        ctx.beginPath();
        ctx.arc(
            this.position.x + GAME_CONFIG.TILE_SIZE/2,
            this.position.y + GAME_CONFIG.TILE_SIZE/2,
            GAME_CONFIG.TILE_SIZE/2 - 2,
            0,
            Math.PI * 2
        );
        
        const gradient = ctx.createRadialGradient(
            this.position.x + GAME_CONFIG.TILE_SIZE/2 - 3,
            this.position.y + GAME_CONFIG.TILE_SIZE/2 - 3,
            2,
            this.position.x + GAME_CONFIG.TILE_SIZE/2,
            this.position.y + GAME_CONFIG.TILE_SIZE/2,
            GAME_CONFIG.TILE_SIZE/2
        );
        
        gradient.addColorStop(0, '#ff6b6b');
        gradient.addColorStop(0.5, GAME_CONFIG.COLORS.APPLE);
        gradient.addColorStop(1, '#cc1e1e');
        
        ctx.fillStyle = gradient;
        ctx.fill();
        ctx.closePath();

        // Apple stem
        ctx.beginPath();
        ctx.moveTo(this.position.x + GAME_CONFIG.TILE_SIZE/2, this.position.y + GAME_CONFIG.TILE_SIZE/4);
        ctx.lineTo(this.position.x + GAME_CONFIG.TILE_SIZE/2 + 3, this.position.y + GAME_CONFIG.TILE_SIZE/8);
        ctx.strokeStyle = '#4a3500';
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.closePath();

        // Leaf
        ctx.beginPath();
        ctx.arc(
            this.position.x + GAME_CONFIG.TILE_SIZE/2 + 4,
            this.position.y + GAME_CONFIG.TILE_SIZE/6,
            3,
            0,
            Math.PI * 2
        );
        ctx.fillStyle = '#4ecca3';
        ctx.fill();
        ctx.closePath();
    }
}