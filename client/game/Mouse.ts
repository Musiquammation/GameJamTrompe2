import { GameHandler } from "../handler/GameHandler";
import { normalizeVector } from "../handler/Vector2";
import { Cheese } from "./Cheese";
import { Entity } from "./Entity";
import { Game } from "./Game";
import { Lava } from "./Lava";

export class Mouse extends Entity {
	private static readonly HP = 400;
	private static readonly SIZE = 16;
	private static readonly WALK_SPEED = 1;
	private static readonly DAMAGES = 30;
	private static readonly CHEESE_RANGE = 100;
	private static readonly CHEESE_MAX_DAMAGES = 10;
	private static readonly FOLLOW_ACC = .016;

	private followingSpeed = -1; // negative if we follow a cheese

	private searchCheese(cheeses: Cheese[]) {
		let best = null;
		let bestDist2 = Mouse.CHEESE_RANGE*Mouse.CHEESE_RANGE;
		for (const cheese of cheeses) {
			const dx = cheese.x - this.x
			const dy = cheese.y - this.y;
			const dist2 = dx*dx + dy*dy;

			// Nearest than previous best cheese
			if (dist2 < bestDist2) {
				best = cheese;
				bestDist2 = dist2;
			}
		}

		return {cheese: best, dist: Math.sqrt(bestDist2)};
	}

	override frame(game: Game, handler: GameHandler) {
		const {cheese, dist} = this.searchCheese(game.cheeses);
		if (cheese) {
			// Eat cheese
			const dmg = (Mouse.CHEESE_RANGE - dist) * 
				(Mouse.CHEESE_MAX_DAMAGES / Mouse.CHEESE_RANGE);
			cheese.hit(dmg);

			this.followingSpeed = -1; // we follow a cheese
		} else if (this.followingSpeed < 0) {
			// Start unfollow
			this.followingSpeed = Mouse.WALK_SPEED;
		} else {
			// Continue unfollow (accelerate)
			this.followingSpeed += Mouse.FOLLOW_ACC;
		}



		// Search nearest cheese around, else take player
		const target = cheese ?? game.player;

		const speed = this.followingSpeed < 0 ?
			Mouse.WALK_SPEED : this.followingSpeed;

		// Get direction to target
		const {x: dx, y: dy} = normalizeVector(
			target.x - this.x,
			target.y - this.y,
			speed
		);

		// Follow target
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
		return this.followingSpeed < 0 ?
			"mouseIdle" : "mouseFly";
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
			list: [Lava, Cheese],
			defaultCollide: true
		}
	}
}

