export interface Vector2 {
	x: number;
	y: number;
}

export function normalizeVector(v: Vector2): Vector2 {
	const dist = Math.sqrt(v.x * v.x + v.y * v.y);
	const ratio = dist <= 1 ? 1 : 1/dist;
	return {
		x: v.x * ratio,
		y: v.y * ratio,
	}
}

