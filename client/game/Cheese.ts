import { GameHandler } from "../handler/GameHandler";
import { Entity } from "./Entity";
import { Game } from "./Game";

export class Cheese extends Entity {
	private static readonly HP = 2000;
	private static readonly SIZE = 16;

	private burning = false;

	constructor(x: number, y: number) {
		super(x, y, Cheese.HP);
	}

	override frame(game: Game, handler: GameHandler) {
		this.burning = false; // reset
	}

	override update(game: Game) {
		// Damage entities passing over lava
		for (const e of game.getEntities()) {
			if (e instanceof Cheese) {
				
			}
		}

		// Loose 1hp for cooldown
		this.hit(1);
	}

	override getMaxHp() {
		return Cheese.HP;
	}

	private getTexture() {
		if (this.burning) {
			return "cheeseHot";
		}

		return "cheese";
	}

	override getSize() {
		return {
			width: Cheese.SIZE,
			height: Cheese.SIZE
		};
	}
	
	override getDrawData() {
		return {
			bars: [{
				value: this.getHp(),
				total: Cheese.HP,
				color: Entity.HP_COLOR,
				background: Entity.HP_BACKGROUND,
				size: Cheese.SIZE * 1.2
			}],
			texture: this.getTexture()
		};
	}

	override getCollidingClasses() {
		return {
			list: [],
			defaultCollide: false
		}
	}

	override onBurning() {
		this.burning = true;
	}
}

