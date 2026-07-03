import { GameHandler } from "../handler/GameHandler";
import { normalizeVector } from "../handler/Vector2";
import { Entity } from "./Entity";
import { Game } from "./Game";

export class Mouse extends Entity {
    private static readonly HP = 100;
    private static readonly SIZE = 16;
    private static readonly SPEED = 2;

    override frame(game: Game, handler: GameHandler) {
        const player = game.player;

        // Get direction to player
        const {x: dx, y: dy} = normalizeVector({
            x: player.x - this.x,
            y: player.y - this.y,
        });

        // Follow player
        this.vx = dx * Mouse.SPEED;
        this.vy = dy * Mouse.SPEED;


        return false;
    }

    override getMaxHp() {
        return 100;
    }

    private getTexture() {
        return "playerIdle";
    }
    
    override getDrawData() {
        return {
            bars: [{
                value: this.getHp(),
                total: Mouse.HP,
                color: Entity.HP_COLOR,
                background: Entity.HP_BACKGROUND,
                size: Mouse.SIZE * 1.2
            }],
            texture: this.getTexture(),
            width: Mouse.SIZE,
            height: Mouse.SIZE
        };
    }
}

