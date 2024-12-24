import { GAME_CONFIG } from './config.js';

export class Snake {
    constructor(startX, startY) {
        this.body = [
            { x: startX, y: startY }
        ];
    }

    draw(ctx) {
        this.body.forEach((segment, index) => {
            ctx.beginPath();
            ctx.arc(
                segment.x + GAME_CONFIG.TILE_SIZE/2,
                segment.y + GAME_CONFIG.TILE_SIZE/2,
                GAME_CONFIG.TILE_SIZE/2 - 1,
                0,
                Math.PI * 2
            );

            const gradient = ctx.createRadialGradient(
                segment.x + GAME_CONFIG.TILE_SIZE/2,
                segment.y + GAME_CONFIG.TILE_SIZE/2,
                0,
                segment.x + GAME_CONFIG.TILE_SIZE/2,
                segment.y + GAME_CONFIG.TILE_SIZE/2,
                GAME_CONFIG.TILE_SIZE/2
            );

            if (index === 0) {
                gradient.addColorStop(0, GAME_CONFIG.COLORS.SNAKE_HEAD);
                gradient.addColorStop(1, GAME_CONFIG.COLORS.SNAKE_HEAD_DARK);
            } else {
                gradient.addColorStop(0, GAME_CONFIG.COLORS.SNAKE_BODY);
                gradient.addColorStop(1, GAME_CONFIG.COLORS.SNAKE_BODY_DARK);
            }

            ctx.fillStyle = gradient;
            ctx.fill();
            ctx.closePath();
        });
    }
}