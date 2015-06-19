/// <reference path="tsd/bundle.d.ts" />

module RunningElderly {
	var scene: THREE.Scene;
	var camera: THREE.Camera;
	var renderer: THREE.WebGLRenderer;

	class REObject {
		geometry: THREE.Geometry;
		material: THREE.Material;
		mesh: THREE.Mesh;
	}

	class Character extends REObject {

	}

	class Environment extends REObject {

	}

	export class Game {
		road: Road;

		constructor() {
			// Scene settup
			scene = new THREE.Scene();
			camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 10000);

			// Camera settup
			camera.position.z = 1000;

			// Rendering settup
			renderer = new THREE.WebGLRenderer();
			renderer.setSize(window.innerWidth, window.innerHeight);
		}

		public bindTo(domElem: HTMLElement) {
			domElem.appendChild(renderer.domElement);
		}

		addObj(obj: REObject) {
			scene.add(obj.mesh);
		}

		animate(): void {
			requestAnimationFrame(() => this.animate());
			this.road.rotate();
			renderer.render(scene, camera);
		}
	}

	export class Road extends Environment {

		constructor() {
			super();
			this.geometry = new THREE.BoxGeometry(200, 200, 200);
			this.material = new THREE.MeshBasicMaterial({
				color: 0xff0000,
				wireframe: true
			});

			this.mesh = new THREE.Mesh(this.geometry, this.material);
		}

		rotate() {
			this.mesh.rotation.x += 0.01;
			this.mesh.rotation.y += 0.02;
		}

	}
}

/*
Environment.prototype.createGround = function() {
	var texture = null;
	// Sand texture
	if (this.textureGround) {
		texture =
		THREE.ImageUtils.loadTexture('../images/Sand_002.jpg');
		texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
		texture.repeat.set(10, 10);
	}
	else {
		texture = null;
	}

	var ground = new THREE.Mesh(new THREE.PlaneGeometry(Environment.GROUND_WIDTH,
		Environment.GROUND_LENGTH),
		new THREE.MeshBasicMaterial(
			{ color: this.textureGround ? 0xffffff : 0xaaaaaa, ambient: 0x333333, map: texture }
			)
		);
	ground.rotation.x = -Math.PI / 2;
	ground.position.y = -.02 + Environment.GROUND_Y;
	this.app.scene.add(ground);
	this.ground = ground;
}*/

window.onload = () => {
	var game: RunningElderly.Game;
	game.bindTo(document.body);
	game.animate();
};