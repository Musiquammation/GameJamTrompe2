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
}

