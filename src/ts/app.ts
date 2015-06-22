/// <reference path="tsd/bundle.d.ts" />
/// <reference path="base.ts" />
/// <reference path="road.ts" />
/// <reference path="character.ts" />

module RunningElderly {
	var scene: REScene;
	var camera: THREE.Camera;
	var renderer: THREE.WebGLRenderer;

	export class Game {
		keyboard: KeyboardState;
		roadManager: RoadManager;
		characterManager: CharacterManager;

		constructor(domElem: HTMLElement) {
			scene = new REScene();
			camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 1, 10000);
			renderer = new THREE.WebGLRenderer({
				precision: "highp",
				antialias: true
			});

			// Camera settup
			camera.position.y = 15;
			camera.position.z = 30;
			camera.lookAt(scene.position);

			// Rendering settup
			renderer.setSize(window.innerWidth, window.innerHeight);
			this.bindTo(domElem);

			this.keyboard = new KeyboardState();
			this.roadManager = new RoadManager(scene);
			this.characterManager = new CharacterManager(scene, this.keyboard);
		}

		bindTo(domElem: HTMLElement): void {
			domElem.appendChild(renderer.domElement);
		}

		start(): void {
			this.render();
		}

		render(): void {
			var curTime;
			requestAnimationFrame(() => this.render());
			this.keyboard.update();
			this.roadManager.animate(this.keyboard);
			this.characterManager.animate(this.keyboard);
			renderer.render(scene, camera);
		}
	}

}

window.onload = () => {
	var game: RunningElderly.Game = new RunningElderly.Game(document.body);
	game.start();
};