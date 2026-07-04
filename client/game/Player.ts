import { GameHandler } from "../handler/GameHandler";
import { ImageLoader } from "../handler/ImageLoader";
import { Entity } from "./Entity";
import { Game } from "./Game";
import { Lasso } from "./Lasso";

export class Player extends Entity {
	private static readonly HP = 1000;
	private static readonly SIZE = 24;
	private static readonly SPEED = 3;


	private readonly lasso = new Lasso();

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

		// Call lasso
		if (handler.inputHandler.press('mouse-left')) {
			const {x: mouseX, y: mouseY} = game.getMouse();
			this.lasso.frame(this.x, this.y, mouseX, mouseY);
		} else {
			this.lasso.back
		}
	}

	override update(game: Game) {
		
	}

	override getMaxHp() {
		return Player.HP;
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

	override draw(ctx: CanvasRenderingContext2D, iloader: ImageLoader) {
		// Draw lasso
		this.lasso.draw(ctx);

		// Draw player
		super.draw(ctx, iloader);
	}
}

