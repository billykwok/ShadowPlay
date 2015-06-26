/// <reference path="tsd/bundle.d.ts" />
/// <reference path="tsd/chrome.serial.d.ts" />
/// <reference path="base.ts" />
/// <reference path="road.ts" />
/// <reference path="character.ts" />
/// <reference path="scoreCounter.ts" />

module RunningElderly {
	var scene: REScene;
	var camera: THREE.Camera;
	var renderer: THREE.WebGLRenderer;
	var raycaster: THREE.Raycaster;

	export class Game {
		keyboard: KeyboardState;
		roadManager: RoadManager;
		characterManager: CharacterManager;
		counter: ScoreCounter;
		signal: string;

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

			this.keyboard = new KeyboardState();
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
			this.roadManager.animate(this.keyboard);
			this.characterManager.keyboardAnimate(this.keyboard);
			if (typeof this.signal != 'undefined') this.characterManager.serialAnimate(this.signal);
			this.characterManager.removeCollidedObjs(this.roadManager.getAllObstacles(), this.counter);

			renderer.render(scene, camera);
		}
	}

}

window.onload = () => {
	var game: RunningElderly.Game = new RunningElderly.Game(document.body);
	game.start();

	var id: number = 0;

	chrome.serial.getDevices((ports) => {
		for (var i = 0; i < ports.length; i++) {
			console.log(ports[i].path);
		}
	});
	chrome.serial.connect('/dev/cu.usbmodem1411', { bitrate: 115200 }, (info: chrome.serial.ConnectionInfo) => {
		console.log(info);
		id = info.connectionId;
	});

	function ab2str(buf: ArrayBuffer): string {
		return String.fromCharCode.apply(null, new Uint8Array(buf));
	}

	function onLineReceived(strReceived: string): void {
		game.signal = stringReceived;
	}

	var stringReceived: string = '';
	chrome.serial.onReceive.addListener((info) => {
		if (info.connectionId == id && info.data) {
			var str = ab2str(info.data);
			if (str.charAt(str.length - 1) === '\n') {
				stringReceived += str.substring(0, str.length - 1);
				onLineReceived(stringReceived);
				stringReceived = '';
			} else {
				stringReceived += str;
			}
		}
	});
};