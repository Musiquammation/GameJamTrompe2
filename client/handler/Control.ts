export const CONTROLS = [
	'left',
	'right',
	'up',
	'down',
	'mouse-left',
	'mouse-middle',
	'mouse-right'
] as const;

export type Control = typeof CONTROLS[number];
