import { normalizeVector, Vector2 } from "../handler/Vector2";

export class Lasso {
	private static readonly MOVE_SPEED = 4;
	private static readonly RETRACT_SPEED = 10;
	private static readonly STEP = 10;
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
		{
			const {x: dx, y: dy} = normalizeVector(
				mouseX - this.currentX,
				mouseY - this.currentY,
				Lasso.MOVE_SPEED
			)
	
			// Move point towards the mouse
			this.currentX += dx;
			this.currentY += dy;
		}

		// Add points
		let {x: prevX, y: prevY} = this.points[this.points.length-1];
		while (true) {
			// Check distance with next point
			let dx = this.currentX - prevX;
			let dy = this.currentY - prevY;
			const dist2 = dx*dx + dy*dy;
			if (dist2 <= Lasso.STEP*Lasso.STEP)
				break; // point is too near

			// Move
			const inv = 1/Math.sqrt(dist2);
			this.points.push({x: prevX, y: prevY});
			prevX += dx*inv;
			prevY += dy*inv;
		}
		
	}

	back() {
		if (this.points.length === 0)
			return; // lasso is already empty

		let {x: prevX, y: prevY} = this.points[this.points.length-1];
		let retract = Lasso.RETRACT_SPEED;
		while (retract > 0) {
			const {x: dx, y: dy, length} = normalizeVector(
				this.currentX - prevX,
				this.currentY - prevY,
				retract
			);

			retract -= length;
			this.currentX -= dx;
			this.currentY -= dy;

			console.log(dx, dy, this.currentX - prevX, this.currentY - prevY);
			
			// Check if target is on the point
			if (Math.abs(this.currentX - prevX) + Math.abs(this.currentY - prevY) <= 0.01) {
				this.points.pop(); // remove last point

				if (this.points.length === 0)
					return; // lasso is empty

				// Update point
				const u = this.points[this.points.length-1];
				prevX = u.x;
				prevY = u.y;
			}
		}
		
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