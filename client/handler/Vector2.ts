export interface Vector2 {
	x: number;
	y: number;
}

export function normalizeVector(dx: number, dy: number, norm = 1) {
	const dist = Math.sqrt(dx * dx + dy * dy);
	let length;
	let ratio;
	
	if (dist <= norm) {
		length = dist;
		ratio = 1;
	} else {
		length = norm;
		ratio = norm/dist;
	}

	return {
		x: dx * ratio,
		y: dy * ratio,
		length
	};
}

export function evalDist2(dx: number, dy: number) {
	return dx*dx + dy*dy;
}