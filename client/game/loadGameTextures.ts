import { ImageLoader } from "../handler/ImageLoader";

export function loadGameTextures(iloader: ImageLoader) {
	iloader.load({
		"playerIdle": "assets/elephant.png",
		"mouseIdle": "assets/mouse.png",
		"mouseFly": "assets/flying-mouse.png",
		"lava": "assets/lava.png",
		"cheese": "assets/cheese.png",
		"cheeseHot": "assets/cheese-hot.png",
		"cheeseTransparent": "assets/cheese-transparent.png",
		"cheeseHotTransparent": "assets/cheese-hot-transparent.png",
	});
}
