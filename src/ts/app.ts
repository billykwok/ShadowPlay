/// <reference path="tsd/bundle.d.ts" />
/// <reference path="tsd/chrome.serial.d.ts" />
/// <reference path="base.ts" />
/// <reference path="environment.ts" />
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
		environmentManager: EnvironmentManager;
		roadManager: RoadManager;
		characterManager: CharacterManager;
		counter: ScoreCounter;

		private speed: number;
		private motion: string;
		private lastMotion: string;
		private repeatCount: number;
		private stop: boolean;

		constructor(domElem: HTMLElement) {
			loadResources();

			scene = new REScene();
			camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 1, 10000);
			renderer = new THREE.WebGLRenderer({
				precision: "highp",
				antialias: true,
				alpha: true
			});
			raycaster = new THREE.Raycaster();

			renderer.setClearColor(0xffffff, 0);

			// Camera settup
			camera.position.y = 15;
			camera.position.z = 30;
			camera.lookAt(scene.position);

			// Rendering settup
			// renderer.setSize(window.innerWidth, window.innerHeight);
			renderer.setSize(1024, 768);
			this.bindTo(domElem);

			this.speed = 0.1;
			this.motion = "m";
			this.repeatCount = 1;
			this.stop = false;

			this.keyboard = new KeyboardState();
			this.serial = new SerialState((str: string) => {
				if (str.charAt(0) === "w") {
					this.speed = 0.1 + Math.min(3, parseInt(str.slice(2, str.length)) / 80);
				} else if (str.charAt(0) === "s") {
					this.motion = str.slice(2, str.length);
				}
			});
			this.environmentManager = new EnvironmentManager(scene);
			this.roadManager = new RoadManager(scene);
			this.characterManager = new CharacterManager(scene, this.keyboard);
		}

		bindTo(domElem: HTMLElement): void {
			domElem.appendChild(renderer.domElement);
		}

		start(): void {
			this.counter = new ScoreCounter(<HTMLElement> (document.getElementsByClassName("my-counter")[0]));
			this.render();
		}

		restart(): void {
			this.stop = true;
			this.counter.reset();
			this.clear(scene);
			renderer.clear();
			this.speed = 0.1;
			this.motion = "m";
			this.repeatCount = 1;
			this.stop = false;
			mode = "market";
			this.environmentManager = new EnvironmentManager(scene);
			this.roadManager = new RoadManager(scene);
			this.characterManager = new CharacterManager(scene, this.keyboard);
			this.stop = false;
		}

		clear(element: THREE.Object3D): void {
			var children = element.children;
			for (var i = children.length - 1; i >= 0; --i) {
				var child = children[i];
				this.clear(child);
				child.parent.remove(child);
			};
		}

		render(): void {
			var id: number;
			if (!this.stop) {
				id = requestAnimationFrame(() => this.render());
			} else {
				cancelAnimationFrame(id);
			}
			this.keyboard.update();
			this.environmentManager.animate();
			this.roadManager.animate(this.keyboard, this.speed);

			this.characterManager.keyboardAnimate(this.keyboard);
			this.characterManager.serialAnimate(this.motion);

			this.characterManager.removeCollidedObjs(this.roadManager.getAllObstacles(), this.counter);
			renderer.render(scene, camera);
		}
	}
}

window.onload = () => {
	var game: RunningElderly.Game = new RunningElderly.Game(document.body);

	var btnRestart: HTMLDivElement = <HTMLDivElement> document.getElementsByClassName("btn-restart")[0];
	btnRestart.onclick = () => {
		game.restart();
	};

	var videoElem: HTMLVideoElement = <HTMLVideoElement> document.getElementById("intro-video");
	videoElem.addEventListener("ended", (event) => {
		game.start();
	}, false);

	var btnSkip: HTMLDivElement = <HTMLDivElement> document.getElementsByClassName("btn-skip")[0];
	btnSkip.onclick = (event) => {
		document.body.removeChild(<Node> videoElem);
		btnSkip.parentNode.removeChild(<Node> btnSkip);
		game.start();
	};
};
