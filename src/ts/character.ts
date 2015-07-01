/// <reference path="tsd/bundle.d.ts" />
/// <reference path="base.ts" />
/// <reference path="road.ts" />

module RunningElderly {
	export class CharacterManager {
		character: Character;
		rayCaster: THREE.Raycaster;
		lastReceived: string;

		constructor(scene: REScene, keyboard: KeyboardState) {
			this.character = new Character();
			this.rayCaster = new THREE.Raycaster();
			scene.add(this.character);
		}

		keyboardAnimate = (keyboard: KeyboardState): void => {
			if (keyboard.down("left")) {
				this.character.moveLeft();
			} else if (keyboard.down("right")) {
				this.character.moveRight();
			}
		};

		serialAnimate = (signal: string): void => {
			if (signal.charAt(0) === "l") {
				this.character.moveLeft();
			} else if (signal.charAt(0) === "r") {
				this.character.moveRight();
			}
			this.lastReceived = signal;
		};

		removeCollidedObjs = (objs: Array<RoadObstacle>, counter: ScoreCounter): void => {
			this.rayCaster.set(
				new THREE.Vector3(this.character.position.x, this.character.position.y, this.character.position.z - TRACK_WIDTH / 4),
				new THREE.Vector3(0, 1, -0.5));
			var intersects = this.rayCaster.intersectObjects(objs);
			for (var i = 0; i < intersects.length; ++i) {
				if (intersects[i].object instanceof RewardObstacle) {
					intersects[i].object.parent.remove(intersects[i].object);
					counter.increment();
				} else if (intersects[i].object instanceof TrapObstacle) {
					intersects[i].object.parent.remove(intersects[i].object);
					counter.decrement();
				}
				/*if (intersects[i].object instanceof RewardObstacle) {
					intersects[i].object.parent.remove(intersects[i].object);
					counter.increment();
				} else if (intersects[i].object instanceof TrapObstacle && !(<TrapObstacle> intersects[i].object).isTouched) {
					counter.decrement();
					(<TrapObstacle> intersects[i].object).touch();
				}*/
			}
		};
	}

	class CharacterDummy extends THREE.Mesh {
		material: THREE.MeshBasicMaterial;

		constructor() {
			var geometry: THREE.PlaneBufferGeometry = new THREE.PlaneBufferGeometry(TRACK_WIDTH, TRACK_WIDTH);
			var texture: THREE.Texture = THREE.ImageUtils.loadTexture("img/elderly_back.png");
			texture.minFilter = THREE.LinearMipMapNearestFilter;
			texture.magFilter = THREE.NearestFilter;
			texture.anisotropy = 8;
			this.material = new THREE.MeshBasicMaterial({
				map: texture,
				color: 0xffffff,
				transparent: true,
				side: THREE.FrontSide
			});
			super(geometry, this.material);
			this.lookAt(new THREE.Vector3(0, 15, 30));
		}
	}

	export class Character extends THREE.Group {
		characterDummy: CharacterDummy;
		collisionPlane: THREE.Mesh;

		constructor() {
			super();
			this.characterDummy = new CharacterDummy();
			this.add(this.characterDummy);

			var geometry: THREE.PlaneBufferGeometry = new THREE.PlaneBufferGeometry(TRACK_WIDTH, TRACK_WIDTH);
			var material: THREE.Material = new THREE.MeshBasicMaterial({
				// color: 0xff0000
				visible: false
			});
			this.collisionPlane = new THREE.Mesh(geometry, material);
			this.collisionPlane.name = "collisionPlane";
			this.collisionPlane.translateZ(- TRACK_WIDTH / 4);
			this.add(this.collisionPlane);
			this.position.set(0, TRACK_WIDTH / 2, TRACK_WIDTH * 1.6);
		}

		moveLeft(): void {
			if (this.position.x > TRACK_WIDTH * 0.5) {
				this.moveToMiddle();
			} else if (this.position.x > - TRACK_WIDTH * 0.5) {
				this.moveToLeft();
			}
		}

		moveRight(): void {
			if (this.position.x < -TRACK_WIDTH * 0.5) {
				this.moveToMiddle();
			} else if (this.position.x < TRACK_WIDTH * 0.5) {
				this.moveToRight();
			}
		}

		moveToLeft(): void {
			this.characterDummy.material.map = THREE.ImageUtils.loadTexture("img/elderly_left.png");
			this.characterDummy.material.needsUpdate = true;
			this.position.x = - TRACK_WIDTH;
		}

		moveToMiddle(): void {
			this.characterDummy.material.map = THREE.ImageUtils.loadTexture("img/elderly_back.png");
			this.characterDummy.material.needsUpdate = true;
			this.position.x = 0;
		}

		moveToRight(): void {
			this.characterDummy.material.map = THREE.ImageUtils.loadTexture("img/elderly_right.png");
			this.characterDummy.material.needsUpdate = true;
			this.position.x = TRACK_WIDTH;
		}
	};
}