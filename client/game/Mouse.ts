import { GameHandler } from "../handler/GameHandler";
import { normalizeVector, Vector2 } from "../handler/Vector2";
import { Entity } from "./Entity";
import { Game } from "./Game";
import { Lava } from "./Lava";

export class Mouse extends Entity {
	private static readonly HP = 400;
	private static readonly SIZE = 16;
	private static readonly SPEED = 2;
	private static readonly DAMAGES = 30;

	override frame(game: Game, handler: GameHandler) {
		const player = game.player;

		// Get direction to player
		const {x: dx, y: dy} = normalizeVector(
			player.x - this.x,
			player.y - this.y,
			Mouse.SPEED
		);

		// Follow player
		this.vx = dx;
		this.vy = dy;
	}

	override update(game: Game) {
		// Check collision with player
		if (this.isTouching(game.player)) {
			game.player.hit(Mouse.DAMAGES);
			this.kill();
		}
	}

	override getMaxHp() {
		return Mouse.HP;
	}

	private getTexture() {
		return "mouseIdle";
	}

	override getSize() {
		return {
			width: Mouse.SIZE,
			height: Mouse.SIZE
		};
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
		};
	}

	override getCollidingClasses() {
		return {
			list: [Lava],
			defaultCollide: true
		}
	}
}

