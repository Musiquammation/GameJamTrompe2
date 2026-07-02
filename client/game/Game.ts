import { GAME_HEIGHT, GAME_WIDTH } from "../handler/dimensions";
import { isTouchDevice } from "../handler/isTouchDevice";
import { GameHandler } from "../handler/GameHandler";
import { DrawStateData, GameState } from "../handler/states";
import { Vector3 } from "../handler/Vector3";
import { InputHandler } from "../handler/InputHandler";
import { ImageLoader } from "../handler/ImageLoader";


const scoreDiv = document.getElementById("score")!;
const mousePosDiv = document.getElementById("mousePos")!;


export class Game extends GameState {
	private camera: Vector3 = {x: 0, y: 0, z: 20};

	private score = 0;
	private lastMouseX = 0;
	private lastMouseY = 0;
	private lastScreenMouseX = NaN;
	private lastScreenMouseY = NaN;
	private statsPanel?: HTMLDivElement;


	getMousePosition(mouseX: number, mouseY: number) {
		const scaleX = innerWidth / GAME_WIDTH;
		const scaleY = innerHeight / GAME_HEIGHT;
		const scale = Math.min(scaleX, scaleY);

		const offsetX = (innerWidth - GAME_WIDTH * scale) / 2;
		const offsetY = (innerHeight - GAME_HEIGHT * scale) / 2;

		let x = mouseX - offsetX;
		let y = mouseY - offsetY;

		x /= scale;
		y /= scale;

		x -= GAME_WIDTH / 2;
		y -= GAME_HEIGHT / 2;

		x /= this.camera.z;
		y /= this.camera.z;

		x += this.camera.x;
		y += this.camera.y;

		return { x, y };

	}

	enter(data: any, input: InputHandler): void {
		const updateMouse = (x: number, y: number) => {
			mousePosDiv.innerText = `(${x.toFixed(1)},${y.toFixed(1)})`;
			this.lastMouseX = x;
			this.lastMouseY = y;
		}

		

		const mouseUp = (clientX: number, clientY: number) => {
			this.lastScreenMouseX = NaN;
			this.lastScreenMouseY = NaN;

			const {x,y} = this.getMousePosition(clientX, clientY);
			updateMouse(x, y);

		}

		const mouseDown = (
			clientX: number,
			clientY: number,
			buttons: number,
			shiftKey: boolean
		) => {
			this.lastScreenMouseX = NaN;
			this.lastScreenMouseY = NaN;

			const {x,y} = this.getMousePosition(clientX, clientY);

			const leftDown   = (buttons & 1) !== 0;
			const rightDown  = (buttons & 2) !== 0;
			const middleDown = (buttons & 4) !== 0;

			updateMouse(x, y);
		}
		
		const mouseMove = (
			clientX: number,
			clientY: number,
			buttons: number,
			shiftKey: boolean
		) => {
			let {x,y} = this.getMousePosition(clientX, clientY);
						
			const leftDown   = (buttons & 1) !== 0;
			const rightDown  = (buttons & 2) !== 0;
			const middleDown = (buttons & 4) !== 0;

			if (middleDown) {
				this.camera.x += this.lastMouseX - x;
				this.camera.y += this.lastMouseY - y;

				const c = this.getMousePosition(clientX, clientY);
				x = c.x;
				y = c.y;
			}

			updateMouse(x, y);
			this.lastScreenMouseX = clientX;
			this.lastScreenMouseY = clientY;

		};

		input.onMouseUp = e => mouseUp(e.clientX, e.clientY);
		input.onMouseDown = e => mouseDown(e.clientX, e.clientY, e.buttons, e.shiftKey);
		input.onMouseMove = e => mouseMove(e.clientX, e.clientY, e.buttons, e.shiftKey);

		input.onTouchStart = e => {
			this.lastScreenMouseX = NaN;
			this.lastScreenMouseY = NaN;
		};

		input.onTouchMove = e =>
			mouseMove(e.touches[0].clientX, e.touches[0].clientY, 1, false);
		

		input.onScroll = e => {
			let {x,y} = this.getMousePosition(e.clientX, e.clientY);
						
			const leftDown   = (e.buttons & 1) !== 0;
			const rightDown  = (e.buttons & 2) !== 0;
			const middleDown = (e.buttons & 4) !== 0;

			updateMouse(x, y);
		}
	}


	frame(game: GameHandler) {
		return null;
	}


	
	private drawGame(ctx: CanvasRenderingContext2D, iloader: ImageLoader) {

	}

	private drawStats(ctx: CanvasRenderingContext2D) {
		scoreDiv.innerText = this.score.toString().padStart(5, "0");
	}

	draw(args: DrawStateData): void {
		{
			// Background
			args.ctx.fillStyle = "#111";
			args.ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

		}
		// Draw game
		args.followCamera();

		this.drawGame(args.ctx, args.imageLoader);

		args.unfollowCamera();


		// Draw stats
		this.drawStats(args.ctx);
	}

	exit() {
		document.getElementById("gameView")?.classList.add("hidden");
		
		if (this.statsPanel) {
			this.statsPanel.remove();
		}

		return {score: this.score};	
	}

	getCamera() {
		return this.camera;
	}
}


