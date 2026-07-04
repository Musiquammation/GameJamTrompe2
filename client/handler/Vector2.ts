export interface Vector2 {
	x: number;
	y: number;
}

export function normalizeMaxVector(v: Vector2): Vector2 {
	const dist = Math.sqrt(v.x * v.x + v.y * v.y);
	if (dist <= 1)
		return v;

	const ratio = 1/dist;
	return {
		x: v.x * ratio,
		y: v.y * ratio,
	}
}

