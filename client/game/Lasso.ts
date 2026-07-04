import { normalizeMaxVector, Vector2 } from "../handler/Vector2";

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
		const {x: dx, y: dy} = normalizeMaxVector({
			x: mouseX - this.currentX,
			y: mouseY - this.currentY,
		})

		// Move point towards the mouse
		this.currentX += dx * Lasso.MOUSE_SPEED;
		this.currentY += dy * Lasso.MOUSE_SPEED;


	}


	
}