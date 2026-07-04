import { type Control, CONTROLS } from "./Control";

type Mode = "zqsd" | "wasd";

enum Action {
	NONE,
	DOWN,
	UP,
	DOWN_THEN_UP,
	UP_THEN_DOWN,
}

// Utility function to dynamically initialize objects
function createRecord<T>(defaultValue: T): Record<Control, T> {
	return CONTROLS.reduce((acc, control) => {
		acc[control] = defaultValue;
		return acc;
	}, {} as Record<Control, T>);
}

export class InputHandler {
	static CONTROLS = CONTROLS;
	static CONTROL_STACK_SIZE = 256;

	// No need for separate Keydown / KeyboardCollector classes anymore!
	// createRecord automatically builds an object with all keys initialized to Action.NONE or false.
	private collectedKeys: Record<Control, Action> = createRecord<Action>(Action.NONE);
	private keysDown: Record<Control, boolean> = createRecord<boolean>(false);
	private firstPress: Record<Control, boolean> = createRecord<boolean>(false);
	private killedPress: Record<Control, boolean> = createRecord<boolean>(false);

	private keyMap: Record<string, Control>;

	onMouseUp = (e: MouseEvent) => {};
	onMouseDown = (e: MouseEvent) => {};
	onMouseMove = (e: MouseEvent) => {};
	onScroll = (e: WheelEvent) => {};
	onTouchStart = (e: TouchEvent) => {};
	onTouchEnd = (e: TouchEvent) => {};
	onTouchMove = (e: TouchEvent) => {};

	static KEYBOARDS: Record<Mode, Record<string, Control>> = {
		zqsd: {
			KeyQ: 'left',
			KeyS: 'right',
			KeyZ: 'up',
			KeyD: 'down',
			
			ArrowLeft: 'left',
			ArrowRight: 'right',
			ArrowUp: 'up',
			ArrowDown: 'down',
		},

		wasd: {
			KeyA: 'left',
			KeyD: 'right',
			KeyW: 'up',
			KeyS: 'down',

			ArrowLeft: 'left',
			ArrowRight: 'right',
			ArrowUp: 'up',
			ArrowDown: 'down',

		},
	};

	constructor(mode: Mode) {
		this.keyMap = InputHandler.KEYBOARDS[mode];
	}

	applyKeydown(control: Control) {
		switch (this.collectedKeys[control]) {
			case Action.NONE:
				this.collectedKeys[control] = Action.DOWN;
				break;
			case Action.DOWN:
				break;
			case Action.UP:
			case Action.DOWN_THEN_UP:
			case Action.UP_THEN_DOWN:
				this.collectedKeys[control] = Action.UP_THEN_DOWN;
				break;
		}
	}

	applyKeyup(control: Control) {
		switch (this.collectedKeys[control]) {
			case Action.NONE:
				this.collectedKeys[control] = Action.UP;
				break;
			case Action.DOWN:
			case Action.DOWN_THEN_UP:
			case Action.UP_THEN_DOWN:
				this.collectedKeys[control] = Action.DOWN_THEN_UP;
				break;
			case Action.UP:
				break;
		}
	}

	private onKeydown = (event: Event) => {
		const e = event as KeyboardEvent;
		const control = this.keyMap[e.code];
		if (control) {
			this.applyKeydown(control);
		}
	}

	private onKeyup = (event: Event) => {
		const e = event as KeyboardEvent;
		const control = this.keyMap[e.code];
		if (control) {
			this.applyKeyup(control);
		}
	}

	private onButtonTouchStart = (control: Control | 'special', element: HTMLElement) => {
		element.classList.add("high");

		if (control === 'special') return;

		this.applyKeydown(control); // Reuse existing method (DRY)
	}

	private onButtonTouchEnd = (control: Control | 'special', element: HTMLElement) => {
		element.classList.remove("high");

		if (control === 'special') return;

		this.applyKeyup(control); // Reuse existing method (DRY)
	}

	startKeydownListeners(target: EventTarget) {
		target.addEventListener("keydown", this.onKeydown);
		target.addEventListener("keyup", this.onKeyup);
	}

	private static mouseButtonToControl(e: MouseEvent): Control | null {
		switch (e.button) {
			case 0:
				return "mouse-left";
			case 1:
				return "mouse-middle";
			case 2:
				return "mouse-right";
			default:
				return null;
		}
	}

	startMouseListeners(target: EventTarget) {
		target.addEventListener('mousedown', (e) => {
			const control = InputHandler.mouseButtonToControl(e as MouseEvent);
			if (control) this.applyKeydown(control);
		});

		target.addEventListener('mouseup', (e) => {
			const control = InputHandler.mouseButtonToControl(e as MouseEvent);
			if (control) this.applyKeyup(control);
		});
		
		target.addEventListener('mousemove', e => this.onMouseMove(e as MouseEvent));
		
		target.addEventListener('wheel', e => {
			const we = e as WheelEvent;
			if (we.ctrlKey) {
				we.preventDefault();
			}
			this.onScroll(we);
		}, { passive: false });

		target.addEventListener('touchstart', e => this.onTouchStart(e as TouchEvent));
		target.addEventListener('touchend', e => this.onTouchEnd(e as TouchEvent));
		target.addEventListener('touchmove', e => this.onTouchMove(e as TouchEvent));
	}

	removeListeners(target: EventTarget) {
		target.removeEventListener("keydown", this.onKeydown);
		target.removeEventListener("keyup", this.onKeyup);
	}
	
	update() {
		for (const control of InputHandler.CONTROLS) {
			this.play(control, this.collectedKeys[control]);
			this.collectedKeys[control] = Action.NONE;
		}
	}

	play(control: Control, action: Action) {
		switch (action) {
			case Action.NONE:
				this.firstPress[control] = false;
				this.killedPress[control] = false;
				break;

			case Action.DOWN:
				if (this.keysDown[control]) {
					this.firstPress[control] = false;
				} else {
					this.firstPress[control] = true;
					this.keysDown[control] = true;
				}
				this.killedPress[control] = false;
				break;

			case Action.UP:
				if (this.keysDown[control]) {
					this.firstPress[control] = false;
					this.keysDown[control] = false;
					this.killedPress[control] = true;
				} else {
					this.firstPress[control] = false;
					this.killedPress[control] = false;
				}
				break;

			case Action.DOWN_THEN_UP:
				if (this.keysDown[control]) {
					this.firstPress[control] = false;
					this.keysDown[control] = false;
				} else {
					this.firstPress[control] = true;
				}
				this.killedPress[control] = true;
				break;

			case Action.UP_THEN_DOWN:
				if (this.keysDown[control]) {
					this.firstPress[control] = false;
					this.keysDown[control] = false;
					this.killedPress[control] = true;
				} else {
					this.firstPress[control] = false;
					this.killedPress[control] = false;
				}

				if (this.keysDown[control]) {
					this.firstPress[control] = false;
				} else {
					this.firstPress[control] = true;
					this.keysDown[control] = true;
				}
				this.killedPress[control] = false;
				break;
		}
	}

	press(control: Control): boolean {
		return this.firstPress[control] || this.keysDown[control];
	}

	first(control: Control): boolean {
		return this.firstPress[control];
	}

	killed(control: Control): boolean {
		return this.killedPress[control];
	}

	kill(control: Control, removeFirstPress = false) {
		this.keysDown[control] = false;
		if (removeFirstPress) {
			this.firstPress[control] = false;
		}
	}
}