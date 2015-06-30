/// <reference path="tsd/bundle.d.ts" />
/// <reference path="collections.ts" />
/// <reference path="keyboard.ts" />
/// <reference path="serial.ts" />

module RunningElderly {
	export var SEGMENT_LENGTH: number = 60;
	export var TRACK_WIDTH: number = 10;
	export var MAX_SEGMENT_NUMBER: number = 4;

	export class REScene extends THREE.Scene {
		getObjectById(id: string | number): THREE.Object3D {
			return super.getObjectById(<string> id);
		}
		
		removeObjectById(id: string | number): void {
			super.remove(super.getObjectById(<string> id));
		}
	}
}