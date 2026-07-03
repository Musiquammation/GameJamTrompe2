import { GameHandler } from "../handler/GameHandler";
import { Entity } from "./Entity";
import { Game } from "./Game";

export class Player extends Entity {
	private static readonly HP = 100;
	private static readonly SIZE = 32;

	override frame(game: Game, handler: GameHandler) {
		this.hit(1);
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
				total: Player.HP,
				color: Entity.HP_COLOR,
				background: Entity.HP_BACKGROUND,
				size: Player.SIZE * 1.2
			}],
			texture: this.getTexture(),
			width: Player.SIZE,
			height: Player.SIZE
		};
	}
}

