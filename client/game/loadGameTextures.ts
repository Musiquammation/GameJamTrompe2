import { ImageLoader } from "../handler/ImageLoader";

export function loadGameTextures(iloader: ImageLoader) {
	iloader.load({
		"playerIdle": "assets/elephant.png",
		"mouseIdle": "assets/mouse.png",
		"lava": "assets/lava.png",
	});
}