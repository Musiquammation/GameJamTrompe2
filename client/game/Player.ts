import { GameHandler } from "../handler/GameHandler";
import { Entity } from "./Entity";
import { Game } from "./Game";

export class Player extends Entity {
	private static readonly HP = 100;
	private static readonly SIZE = 24;
	private static readonly SPEED = 3;

	override frame(game: Game, handler: GameHandler) {
		// Collect inputs
		const pressRight = handler.inputHandler.press('right');
		const pressLeft = handler.inputHandler.press('left');
		const pressUp = handler.inputHandler.press('up');
		const pressDown = handler.inputHandler.press('down');

		// Set vx
		if (pressRight === pressLeft) {
			this.vx = 0; // no movement
		} else if (pressRight) {
			this.vx = +Player.SPEED; // set velocity to the right
		} else {
			this.vx = -Player.SPEED; // set velocity to the left
		}

		// Set vy
		if (pressDown === pressUp) {
			this.vy = 0; // no movement
		} else if (pressDown) {
			this.vy = +Player.SPEED; // set velocity to the down
		} else {
			this.vy = -Player.SPEED; // set velocity to the up
		}
	}

	override update(game: Game, handler: GameHandler) {
		
	}

	override getMaxHp() {
		return 100;
	}

	private getTexture() {
		return "playerIdle";
	}

	override getSize() {
		return {
			width: Player.SIZE,
			height: Player.SIZE
		};
	}
	
	override getDrawData() {
		return {
			bars: [{
				value: this.getHp(),
				total: Player.HP,
				color: Entity.HP_COLOR,
				background: Entity.HP_BACKGROUND,
				size: Player.SIZE * 1.2
			}],
			texture: this.getTexture()
		};
	}
}

