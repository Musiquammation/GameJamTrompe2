import { GameHandler } from "../handler/GameHandler";
import { ImageLoader } from "../handler/ImageLoader";
import { GameState } from "../handler/states";
import { Entity } from "./Entity";
import { GameLayer } from "./GameLayer";
import { Lava } from "./Lava";
import { Mouse } from "./Mouse";
import { Player } from "./Player";

export class Game extends GameLayer {
	player = new Player(0, 0);
	mouses = new Array<Mouse>();
	lavas = new Array<Lava>();

	// tests
	constructor() {
		super();
		this.test();
	}

	private test() {
		this.mouses.push(new Mouse(20, 0));
		this.lavas.push(new Lava(100, 0, 30, 30, 1000))
	}

	*getEntities(): Generator<Entity> {
		yield this.player;
		yield *this.mouses;
		yield *this.lavas;
	}
	
	frame(handler: GameHandler): GameState | null {
		// Run frames
		for (const entity of this.getEntities()) {
			entity.frame(this, handler);
		}

		/// TODO: collisions
		
		
		// Move
		for (const entity of this.getEntities()) {
			entity.move();
		}

		// Update
		for (const entity of this.getEntities()) {
			entity.update(this, handler);
		}


		return null;
	}

	drawGame(ctx: CanvasRenderingContext2D, iloader: ImageLoader) {
		for (const entity of this.getEntities()) {
			entity.draw(ctx, iloader);
		}
	}
}
