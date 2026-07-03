import { GameHandler } from "../handler/GameHandler";
import { normalizeVector, Vector2 } from "../handler/Vector2";
import { Entity } from "./Entity";
import { Game } from "./Game";

export class Lava extends Entity {
    private static readonly DAMAGES = 1;

    private width: number;
    private height: number;
    private duration: number;

    constructor(x: number, y: number, width: number, height: number, duration: number) {
        super(x, y, duration);
        this.width = width;
        this.height = height;
        this.duration = duration;
    }

    override frame(game: Game, handler: GameHandler) {
    }

    override update(game: Game, handler: GameHandler) {
        // Damage entities passing over lava
        for (const e of game.getEntities()) {
            if (e instanceof Lava)
                continue;

            if (this.isTouching(e)) {
                e.hit(Lava.DAMAGES);
            }
        }

        // Loose 1hp for cooldown
        this.hit(1);


        return false;
    }

    override getMaxHp() {
        return this.duration;
    }

    private getTexture() {
        return "lavaIdle";
    }

    override getSize() {
		return {
			width: this.width,
			height: this.height
		};
	}
    
    override getDrawData() {
        return {
            bars: [{
                value: this.getHp(),
                total: this.duration,
                color: Entity.HP_COLOR,
                background: Entity.HP_BACKGROUND,
                size: this.width * 1.2
            }],
            texture: this.getTexture()
        };
    }
}

