import { normalizeVector, Vector2 } from "../handler/Vector2";

export class Lasso {
	private static readonly MOUSE_SPEED = 3;
	private currentX = 0;
	private currentY = 0;

	private points = new Array<Vector2>();

	frame(srcX: number, srcY: number, mouseX: number, mouseY: number) {
		// Lasso is empty?
		if (this.points.length === 0) {
			this.currentX = srcX;
			this.currentY = srcY;
			this.points.push({
				x: srcX,
				y: srcY,
			});
		}

		// Follow mouse
		const {x: dx, y: dy} = normalizeVector(
			mouseX - this.currentX,
			mouseY - this.currentY,
			Lasso.MOUSE_SPEED
		)

		// Move point towards the mouse
		this.currentX += dx;
		this.currentY += dy;
	}


	draw(ctx: CanvasRenderingContext2D) {
		if (this.points.length === 0)
			return; // nothing to draw

		ctx.save();

		ctx.strokeStyle = "#777";
		for (let i = 0; i < this.points.length - 1; i++) {
			ctx.beginPath();
			ctx.moveTo(this.points[i].x, this.points[i].y);
			ctx.lineTo(this.points[i + 1].x, this.points[i + 1].y);
			ctx.stroke();
		}

		ctx.beginPath();
		ctx.moveTo(this.points[this.points.length - 1].x, this.points[this.points.length - 1].y);
		ctx.lineTo(this.currentX, this.currentY);
		ctx.stroke();

		ctx.restore();
	}
}