/// <reference path="tsd/bundle.d.ts" />
/// <reference path="base.ts" />

module RunningElderly {
	export class CharacterManager {
		scene: REScene;
		character: Character;

		constructor(scene: REScene, keyboard: THREEx.KeyboardState) {
			this.scene = scene;
			this.character = new Character();
			scene.add(this.character);
		}

		animate = (keyboard: THREEx.KeyboardState): void => {
			if (keyboard.down('left')) {
				if (this.character.position.x > - TRACK_WIDTH) this.character.translateX(- TRACK_WIDTH);
			} else if (keyboard.down('right')) {
				if (this.character.position.x < TRACK_WIDTH) this.character.translateX(TRACK_WIDTH);
			}
		}
	}

	class Character extends THREE.Mesh {
		constructor() {
			var geometry: THREE.PlaneBufferGeometry = new THREE.PlaneBufferGeometry(TRACK_WIDTH, TRACK_WIDTH);
			var texture: THREE.Texture = THREE.ImageUtils.loadTexture('build/img/elderly.png');
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