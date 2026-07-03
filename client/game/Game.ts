import { GameHandler } from "../handler/GameHandler";
import { ImageLoader } from "../handler/ImageLoader";
import { GameState } from "../handler/states";
import { Entity } from "./Entity";
import { GameLayer } from "./GameLayer";
import { Player } from "./Player";

export class Game extends GameLayer {
	player = new Player(0, 0);

	private *getEntities(): Generator<Entity> {
		yield this.player;
	}
	
	frame(handler: GameHandler): GameState | null {
		for (const entity of this.getEntities()) {
			entity.frame(this, handler);
		}

		return null;
	}

	drawGame(ctx: CanvasRenderingContext2D, iloader: ImageLoader) {
		for (const entity of this.getEntities()) {
			entity.draw(ctx, iloader);
		}
	}
}
