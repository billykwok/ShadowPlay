/// <reference path="tsd/bundle.d.ts" />
/// <reference path="tsd/chrome.serial.d.ts" />
/// <reference path="base.ts" />
/// <reference path="road.ts" />
/// <reference path="character.ts" />
/// <reference path="score.ts" />

module RunningElderly {
	var scene: REScene;
	var camera: THREE.Camera;
	var renderer: THREE.WebGLRenderer;
	var raycaster: THREE.Raycaster;

	export class Game {
		keyboard: KeyboardState;
		serial: SerialState;
		roadManager: RoadManager;
		characterManager: CharacterManager;
		counter: ScoreCounter;

		private speed: number;
		private motion: string;

		constructor(domElem: HTMLElement) {
			scene = new REScene();
			camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 1, 10000);
			renderer = new THREE.WebGLRenderer({
				precision: "highp",
				antialias: true
			});
			raycaster = new THREE.Raycaster();

			renderer.setClearColor(0xffffff, 1);

			// Camera settup
			camera.position.y = 15;
			camera.position.z = 30;
			camera.lookAt(scene.position);

			// Rendering settup
			renderer.setSize(window.innerWidth, window.innerHeight);
			this.bindTo(domElem);

			this.speed = 0.5;
			this.motion = "";

			this.keyboard = new KeyboardState();
			this.serial = new SerialState((str: string) => {
				if (str.charAt(0) === 'w') {
					this.speed = 0.5 + Math.min(100, parseInt(str.slice(2, str.length)));
					console.log(this.speed);
				} else if (str.charAt(0) === 's') {
					this.motion = parseInt(str.slice(2, str.length)) > 17000 ? "l" : "r";
					console.log(this.motion);
				}
			});
			this.roadManager = new RoadManager(scene);
			this.characterManager = new CharacterManager(scene, this.keyboard);
			this.counter = new ScoreCounter(<HTMLElement> (document.getElementsByClassName('my-counter')[0]));
		}

		bindTo(domElem: HTMLElement): void {
			domElem.appendChild(renderer.domElement);
		}

		start(): void {
			this.render();
		}

		render(): void {
			requestAnimationFrame(() => this.render());

			this.keyboard.update();

			this.roadManager.animate(this.keyboard, this.speed);

			this.characterManager.keyboardAnimate(this.keyboard);
			if (typeof this.motion != 'undefined')
				this.characterManager.serialAnimate(this.motion);

			this.characterManager.removeCollidedObjs(this.roadManager.getAllObstacles(), this.counter);

			renderer.render(scene, camera);
		}
	}

}

window.onload = () => {
	var game: RunningElderly.Game = new RunningElderly.Game(document.body);
	game.start();
};