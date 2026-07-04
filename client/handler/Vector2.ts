export interface Vector2 {
	x: number;
	y: number;
}

export function normalizeVector(dx: number, dy: number, norm = 1): Vector2 {
	const dist = Math.sqrt(dx * dx + dy * dy);
	const ratio = dist <= norm ? 1 : norm/dist;
	return {
		x: dx * ratio,
		y: dy * ratio,
	}
}

export function evalDist2(dx: number, dy: number) {
	return dx*dx + dy*dy;
}