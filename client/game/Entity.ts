import { GameHandler } from "../handler/GameHandler";
import { ImageLoader } from "../handler/ImageLoader";
import { Game } from "./Game";

interface DrawBar {
	value: number;
	total: number;
	color: string;
	background: string;
	size: number;
}

interface DrawData {
	bars: DrawBar[];
	texture: string;
}


export abstract class Entity {
	protected static readonly HP_COLOR = "#ff0044";
	protected static readonly HP_BACKGROUND = "#3f0011";
	protected static readonly HP_SIZE = 100;

	x: number;
	y: number;
	vx: number = 0;
	vy: number = 0;
	private hp: number;

	constructor(x: number, y: number, hp = this.getMaxHp()) {
		this.x = x;
		this.y = y;
		this.hp = hp;
	}

	getHp() {
		return Math.max(this.hp, 0);
	}

	heal(hp: number) {
		this.hp += hp;
		const max = this.getMaxHp();
		if (this.hp > max) {
			this.hp = max;
		}
	}

	hit(damages: number) {
		this.hp -= damages;
	}

	kill() {
		this.hp = -Infinity;
	}

	abstract frame(game: Game, handler: GameHandler): void;
	abstract update(game: Game): void;

	move() {
		this.x += this.vx;
		this.y += this.vy;
	}

	abstract getMaxHp(): number;

	abstract getSize(): {width: number, height: number};

	protected abstract getDrawData(): DrawData;

	abstract getCollidingClasses(): {
		list: (new (...args: any[]) => Entity)[],
		defaultCollide: boolean
	};

	protected drawBars(
		ctx: CanvasRenderingContext2D,
		bars: DrawBar[],
		height: number
	) {
		let y = this.y - (height/2 + Math.min(10, height*.3));

		for (const bar of bars) {
			const w = bar.size;
			const h = 3;

			ctx.strokeStyle = "white";
			ctx.lineWidth = 1;
			ctx.fillStyle = bar.background;
			ctx.strokeRect(this.x - w/2, y, w, h);
			ctx.fillRect(this.x - w/2, y, w, h);

			ctx.fillStyle = bar.color;
			ctx.fillRect(
				this.x - w/2,
				y,
				w * (bar.value / bar.total),
				h
			);

			y -= h + 2;
		}
	}

	draw(ctx: CanvasRenderingContext2D, iloader: ImageLoader) {
		const { bars, texture } = this.getDrawData();
		const { width, height } = this.getSize();

		const img = iloader.get(texture);
		ctx.drawImage(
			img,
			this.x - width/2,
			this.y - height/2,
			width,
			height
		);

		this.drawBars(ctx, bars, height);
	}

	isTouching(other: Entity): boolean {
		const a = this.getSize();
		const b = other.getSize();

		const ax1 = this.x - a.width / 2;
		const ax2 = this.x + a.width / 2;
		const ay1 = this.y - a.height / 2;
		const ay2 = this.y + a.height / 2;

		const bx1 = other.x - b.width / 2;
		const bx2 = other.x + b.width / 2;
		const by1 = other.y - b.height / 2;
		const by2 = other.y + b.height / 2;

		return (
			ax1 < bx2 &&
			ax2 > bx1 &&
			ay1 < by2 &&
			ay2 > by1
		);
	}



	applyCollision(m: Entity) {
		const thisSize = this.getSize();
		const mSize = m.getSize();

		// Compute equivalent radii (as in your Python version)
		const rthis = (thisSize.width + thisSize.height) / 4;
		const rM = (mSize.width + mSize.height) / 4;
		const minDist = rthis + rM;

		let dx = this.x - m.x;
		let dy = this.y - m.y;
		let dist = Math.sqrt(dx * dx + dy * dy);

		if (dist === 0) {
			dx = 1.0;
			dy = 0.0;
			dist = 1.0;
		}

		if (dist < minDist) {
			// Normalize collision vector
			const nx = dx / dist;
			const ny = dy / dist;

			// Separate both entities
			const overlap = minDist - dist;
			this.x += (nx * overlap) / 2;
			this.y += (ny * overlap) / 2;
			m.x -= (nx * overlap) / 2;
			m.y -= (ny * overlap) / 2;

			// Reflect velocities along collision axis
			const dvx = this.vx - m.vx;
			const dvy = this.vy - m.vy;
			const dot = dvx * nx + dvy * ny;

			if (dot < 0) { // Only if they are moving toward each other
				this.vx -= dot * nx;
				this.vy -= dot * ny;
				m.vx += dot * nx;
				m.vy += dot * ny;
			}

			const rthisW = thisSize.width / 2;
			const rthisH = thisSize.height / 2;
			const rMW = mSize.width / 2;
			const rMH = mSize.height / 2;

			this.x = Math.max(-Game.WIDTH + rthisW, Math.min(this.x, Game.WIDTH - rthisW));
			this.y = Math.max(-Game.HEIGHT + rthisH, Math.min(this.y, Game.HEIGHT - rthisH));
			m.x = Math.max(-Game.WIDTH + rMW, Math.min(m.x, Game.WIDTH - rMW));
			m.y = Math.max(-Game.HEIGHT + rMH, Math.min(m.y, Game.HEIGHT - rMH));
		}
	}
}

