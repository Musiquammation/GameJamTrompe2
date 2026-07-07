import { GameHandler } from "../handler/GameHandler";
import { ImageLoader } from "../handler/ImageLoader";
import { GameState } from "../handler/states";
import { Cheese } from "./Cheese";
import { Entity } from "./Entity";
import { GameLayer } from "./GameLayer";
import { Lava } from "./Lava";
import { Mouse } from "./Mouse";
import { Player } from "./Player";

export class Game extends GameLayer {
	player = new Player(0, 0);
	mouses = new Array<Mouse>();
	lavas = new Array<Lava>();
	cheeses = new Array<Cheese>();

	static readonly WIDTH = 220;
	static readonly HEIGHT = 123;

	// tests
	constructor() {
		super();
		this.test();
	}

	private test() {
		for (let i = 0; i < 1; i++)
			this.mouses.push(new Mouse(-200, 0));

		for (let i = 0; i < 1; i++)
			this.cheeses.push(new Cheese(60+i/10, i/10));
		// this.lavas.push(new Lava(100, 0, 100, 100, 1000))
	}

	private static removeDeadInPlace<T extends Entity>(arr: T[]): void {
		let write = 0;

		for (let read = 0; read < arr.length; read++) {
			const e = arr[read];

			if (e.isInGame()) {
				arr[write] = e;
				write++;
			}
		}

		arr.length = write;
	}

	*getEntities(takePlayerCheese = true): Generator<Entity> {
		yield *this.lavas;
		yield *this.mouses;
		yield *this.cheeses;
		yield this.player;

		if (takePlayerCheese) {
			const playerCheese = this.player.getCheese();
			if (playerCheese) {
				yield playerCheese;
			}
		}
	}
	
	frame(handler: GameHandler): GameState | null {
		// Run frames
		for (const entity of this.getEntities()) {
			entity.frame(this, handler);
		}		
		
		// Move
		for (const entity of this.getEntities()) {
			entity.move();
		}

		// Collisions
		const entities = Array.from(this.getEntities(false));
		for (let i = 0; i < entities.length; i++) {
			const self = entities[i];
			for (let j = i + 1; j < entities.length; j++) {
				const m = entities[j];
				const {
					list,
					defaultCollide
				} = self.getCollidingClasses();

				let notFound = true;
				for (const k of list) {
					if (m instanceof k) {
						if (!defaultCollide) {
							self.applyCollision(m);
						}
						notFound = false;
						break;
					}
				}

				if (notFound && defaultCollide) {
					self.applyCollision(m);
				}
			}
		}


		// Update
		for (const entity of this.getEntities()) {
			entity.update(this);
		}


		// Remove entities
		Game.removeDeadInPlace(this.mouses);
		Game.removeDeadInPlace(this.lavas);
		Game.removeDeadInPlace(this.cheeses);


		return null;
	}

	drawGame(ctx: CanvasRenderingContext2D, iloader: ImageLoader) {
		for (const entity of this.getEntities()) {
			entity.draw(ctx, iloader);
		}
	}
}
