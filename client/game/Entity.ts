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
	width: number;
	height: number;
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

	constructor(x: number, y: number) {
		this.x = x;
		this.y = y;
		this.hp = this.getMaxHp();
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

	abstract frame(game: Game, handler: GameHandler): boolean;

	move() {
		this.x += this.vx;
		this.y += this.vy;
	}

	abstract getMaxHp(): number;

	protected abstract getDrawData(): DrawData;

	draw(ctx: CanvasRenderingContext2D, iloader: ImageLoader) {
		const { bars, width, height, texture } = this.getDrawData();

		const img = iloader.get(texture);
		ctx.drawImage(
			img,
			this.x - width/2,
			this.y - height/2,
			width,
			height
		);

		let y = this.y - (height/2 + 10);

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
}

