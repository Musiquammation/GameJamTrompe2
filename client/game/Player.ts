import { GameHandler } from "../handler/GameHandler";
import { ImageLoader } from "../handler/ImageLoader";
import { evalDist2, normalizeVector } from "../handler/Vector2";
import { Cheese } from "./Cheese";
import { Entity } from "./Entity";
import { Game } from "./Game";
import { Lasso } from "./Lasso";
import { Lava } from "./Lava";
import { Mouse } from "./Mouse";

export class Player extends Entity {
	private static readonly HP = 1000;
	private static readonly SIZE = 24;
	private static readonly SPEED = 3;
	private static readonly ASPIRATION_SPEED = 4;
	private static readonly CHEESE_RANGE = 5;


	private readonly lasso = new Lasso();
	private cheese: Cheese | null = null;

	private attractMouse(game: Game) {
		const {x, y} = game.getMouse();
		const {x: lassoX, y: lassoY} = this.lasso.getTarget();

		let takenCheese = null;
		for (const cheese of game.cheeses) {
			// Attract cheeses
			const targetDist2 = evalDist2(lassoX - cheese.x, lassoY - cheese.y);

			if (targetDist2 <= Player.CHEESE_RANGE*Player.CHEESE_RANGE) {
				takenCheese = cheese;
				cheese.vx = 0;
				cheese.vy = 0;
				cheese.x = lassoX;
				cheese.y = lassoY;
				continue;
			}

			const dx = x - cheese.x;
			const dy = y - cheese.y;
			const dist2 = dx*dx + dy*dy;
			if (dist2 <= Player.CHEESE_RANGE*Player.CHEESE_RANGE) {
				cheese.vx = 0;
				cheese.vy = 0;
				cheese.x = x;
				cheese.y = y;

			} else {
				const n = normalizeVector(dx, dy, Player.ASPIRATION_SPEED / Math.sqrt(dist2));
				cheese.vx += n.x;
				cheese.vy += n.y;
			}
		}

		if (takenCheese === null)
			return;

		if (takenCheese) {
			this.cheese = takenCheese;
			this.cheese.taken = true;
			console.log("taken");
		}
	}

	private releaseMouse(game: Game) {
		if (this.cheese) {
			game.cheeses.push(this.cheese);
			this.cheese.taken = false;
			this.cheese = null;
		}
	}

	getCheese() {
		return this.cheese;
	}

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
			this.lasso.back();
		}

		// Handle mouse
		if (handler.inputHandler.press('mouse-left')) {
			if (this.cheese) {
				const {x, y} = this.lasso.getTarget();
				this.cheese.x = x;
				this.cheese.y = y;
			} else {
				this.attractMouse(game);
			}
		} else {
			this.releaseMouse(game);
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


	override getCollidingClasses() {
		return {
			list: [Mouse, Lava],
			defaultCollide: true
		}
	}
}

