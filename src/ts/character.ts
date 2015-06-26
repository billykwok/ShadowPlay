/// <reference path="tsd/bundle.d.ts" />
/// <reference path="base.ts" />
/// <reference path="road.ts" />

module RunningElderly {
	export class CharacterManager {
		scene: REScene;
		character: Character;
		rayCaster: THREE.Raycaster;
		lastReceived: string;

		constructor(scene: REScene, keyboard: KeyboardState) {
			this.scene = scene;
			this.character = new Character();
			this.rayCaster = new THREE.Raycaster();
			scene.add(this.character);
		}

		keyboardAnimate = (keyboard: KeyboardState): void => {
			if (keyboard.down('left')) {
				if (this.character.position.x > - TRACK_WIDTH) this.character.translateX(- TRACK_WIDTH);
			} else if (keyboard.down('right')) {
				if (this.character.position.x < TRACK_WIDTH) this.character.translateX(TRACK_WIDTH);
			}
		}

		serialAnimate = (signal: string): void => {
			if (signal === this.lastReceived) return;

			if (signal.charAt(0) === 'l' && this.character.position.x > - TRACK_WIDTH) {
				console.log('left');
				this.character.translateX(-TRACK_WIDTH);
			} else if (signal.charAt(0) === 'r' && this.character.position.x < TRACK_WIDTH) {
				console.log('right');
				this.character.position.x += TRACK_WIDTH;
			}
			this.lastReceived = signal;
		}

		removeCollidedObjs = (objs: Array<RoadObstacle>, counter: ScoreCounter): void => {
			this.rayCaster.set(this.character.position, new THREE.Vector3(0, 1, -1));
			var intersects = this.rayCaster.intersectObjects(objs);
			for (var i = 0; i < intersects.length; ++i) {
				if (intersects[i].object instanceof RewardObstacle) {
					intersects[i].object.parent.remove(intersects[i].object);
					counter.increment();
				} else if (intersects[i].object instanceof TrapObstacle && !(<TrapObstacle> intersects[i].object).isTouched) {
					counter.decrement();
					(<TrapObstacle> intersects[i].object).touch();
				}
			}
		}

	}

	class Character extends THREE.Mesh {
		constructor() {
			var geometry: THREE.PlaneBufferGeometry = new THREE.PlaneBufferGeometry(TRACK_WIDTH, TRACK_WIDTH);
			var texture: THREE.Texture = THREE.ImageUtils.loadTexture('img/elderly.png');
			texture.minFilter = THREE.NearestFilter;
			var material: THREE.Material = new THREE.MeshBasicMaterial({
				map: texture,
				transparent: true,
				side: THREE.FrontSide
			});
			super(geometry, material);
			this.position.set(0, TRACK_WIDTH / 2, TRACK_WIDTH * 1.8);
		}
	}
}