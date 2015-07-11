/// <reference path="tsd/bundle.d.ts" />
/// <reference path="collections.ts" />
/// <reference path="keyboard.ts" />
/// <reference path="serial.ts" />

module RunningElderly {
	export var SEGMENT_LENGTH: number = 48;
	export var TRACK_WIDTH: number = 8;
	export var MAX_SEGMENT_NUMBER: number = 2;
	export var mode: string = "market";
	export var resources = {
		textures: new collections.Dictionary<string, THREE.Texture>(),
		materials: new collections.Dictionary<string, THREE.Material>(),
		meshes: new collections.Dictionary<string, THREE.Mesh>()
	};

	export function loadResources(): void {
		resources.textures.setValue("elderly_left", THREE.ImageUtils.loadTexture("img/elderly_left.png"));
		resources.textures.setValue("elderly_middle", THREE.ImageUtils.loadTexture("img/elderly_back.png"));
		resources.textures.setValue("elderly_right", THREE.ImageUtils.loadTexture("img/elderly_right.png"));
		resources.textures.setValue("insect", THREE.ImageUtils.loadTexture("img/scene_1/insect.png"));
		resources.textures.setValue("egg", THREE.ImageUtils.loadTexture("img/scene_1/egg.png"));
		resources.textures.setValue("eggplant", THREE.ImageUtils.loadTexture("img/scene_1/eggplant.png"));
		resources.textures.setValue("tomato", THREE.ImageUtils.loadTexture("img/scene_1/tomato.png"));
		resources.textures.setValue("carrot", THREE.ImageUtils.loadTexture("img/scene_1/carrot.png"));
		resources.textures.setValue("paprika", THREE.ImageUtils.loadTexture("img/scene_1/paprika.png"));
		resources.textures.setValue("archway1", THREE.ImageUtils.loadTexture("img/scene_1/archway.png"));

		resources.textures.setValue("basin", THREE.ImageUtils.loadTexture("img/scene_2/basin.png"));
		resources.textures.setValue("fan", THREE.ImageUtils.loadTexture("img/scene_2/fan.png"));
		resources.textures.setValue("stool", THREE.ImageUtils.loadTexture("img/scene_2/stool.png"));
		resources.textures.setValue("thermos", THREE.ImageUtils.loadTexture("img/scene_2/thermos.png"));
		resources.textures.setValue("towel", THREE.ImageUtils.loadTexture("img/scene_2/towel.png"));
		resources.textures.setValue("archway2", THREE.ImageUtils.loadTexture("img/scene_2/archway.png"));

		resources.textures.setValue("clothes", THREE.ImageUtils.loadTexture("img/scene_3/clothes.png"));
		resources.textures.setValue("hat", THREE.ImageUtils.loadTexture("img/scene_3/hat.png"));
		resources.textures.setValue("scarf", THREE.ImageUtils.loadTexture("img/scene_3/scarf.png"));
		resources.textures.setValue("shose", THREE.ImageUtils.loadTexture("img/scene_3/shose.png"));
		resources.textures.setValue("trouser", THREE.ImageUtils.loadTexture("img/scene_3/trouser.png"));
		resources.textures.setValue("archway3", THREE.ImageUtils.loadTexture("img/scene_3/archway.png"));

		resources.textures.setValue("left1", THREE.ImageUtils.loadTexture("img/left1.png"));
		resources.textures.setValue("left2", THREE.ImageUtils.loadTexture("img/left2.png"));
		resources.textures.setValue("left3", THREE.ImageUtils.loadTexture("img/left3.png"));
		resources.textures.setValue("left4", THREE.ImageUtils.loadTexture("img/left4.png"));
		resources.textures.setValue("right1", THREE.ImageUtils.loadTexture("img/right1.png"));
		resources.textures.setValue("right2", THREE.ImageUtils.loadTexture("img/right2.png"));
		resources.textures.setValue("right3", THREE.ImageUtils.loadTexture("img/right3.png"));

		resources.textures.forEach((key: string, value: THREE.Texture) => {
			value.minFilter = THREE.LinearMipMapNearestFilter;
			value.magFilter = THREE.NearestFilter;
			value.anisotropy = 8;
		});
	}

	export class REScene extends THREE.Scene {
		getObjectById(id: string | number): THREE.Object3D {
			return super.getObjectById(<string> id);
		}

		removeObjectById(id: string | number): void {
			super.remove(super.getObjectById(<string> id));
		}
	}
}