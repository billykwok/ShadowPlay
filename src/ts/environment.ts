/// <reference path="tsd/bundle.d.ts" />
/// <reference path="base.ts" />

module RunningElderly {
	var SEGMENT_LENGTH: number = 60;
	var OBJECT_WIDTH: number = 30;
	var MAX_SEGMENT_NUMBER: number = 4;

	export class EnvironmentManager {
		scene: REScene;
		segmentIds: Array<number>;

		constructor(scene: REScene) {
			this.scene = scene;
			this.segmentIds = new Array();
		}

		getObstacle(id: string): EnvironmentObject {
			return <EnvironmentObject> this.scene.getObjectById(id);
		}

		getAllObstacles(): Array<EnvironmentObject> {
			var obstacles = new Array<EnvironmentObject>();
			this.segmentIds.forEach((segmentId) => {
				this.scene.getObjectById(segmentId).children.forEach((track) => {
					track.children.forEach((obj) => {
						if (obj instanceof EnvironmentObject) {
							obstacles.push(obj);
						}
					});
				});
			});
			return obstacles;
		}

		animate = (): void => {
			if (this.segmentIds.length == 0) {
				var environmentSegment = new EnvironmentSegment();
				this.segmentIds.push(environmentSegment.id);
				environmentSegment.add(new RoadEnvironmentObject(new THREE.Vector3(0, TRACK_WIDTH * 1.5, 130)));
				this.scene.add(environmentSegment);
			}
			if (this.scene.getObjectById(this.segmentIds[0]).position.z >= SEGMENT_LENGTH) {
				this.scene.removeObjectById(this.segmentIds[0]);
				this.segmentIds = this.segmentIds.slice(1, this.segmentIds.length);
			}
			if (this.segmentIds.length <= MAX_SEGMENT_NUMBER &&
				this.scene.getObjectById(this.segmentIds[this.segmentIds.length - 1]).position.z >= - (MAX_SEGMENT_NUMBER - 1) * SEGMENT_LENGTH) {
				var environmentSegment = new EnvironmentSegment();
				this.segmentIds.push(environmentSegment.id);
				this.scene.add(environmentSegment);
			}
			this.segmentIds.forEach((segmentId) => {
				this.scene.getObjectById(segmentId).position.z += 0.1;
			});
		};
	}

	class EnvironmentSegment extends THREE.Group {
		private environmentLeft: LeftEnvironment;
		private environmentRight: RightEnvironment;
		static indexLeft = 0;
		static indexRight = 0;

		constructor() {
			super();
			this.environmentLeft = new LeftEnvironment(EnvironmentSegment.indexLeft);
			this.add(this.environmentLeft);

			this.environmentRight = new RightEnvironment(EnvironmentSegment.indexRight);
			this.add(this.environmentRight);

			this.translateZ(- MAX_SEGMENT_NUMBER * SEGMENT_LENGTH);

			if (EnvironmentSegment.indexLeft < 3) {
				++EnvironmentSegment.indexLeft;
			} else {
				EnvironmentSegment.indexLeft = 0;
			}
			if (EnvironmentSegment.indexRight < 2) {
				++EnvironmentSegment.indexRight;
			} else {
				EnvironmentSegment.indexRight = 0;
			}
		}
	}

	class LeftEnvironment extends THREE.Group {
		constructor(index: number) {
			super();
			this.add(new LeftEnvironmentObject(index, new THREE.Vector3(0, OBJECT_WIDTH / 2, 0)));
			this.translateX(- TRACK_WIDTH - OBJECT_WIDTH);
		}
	}

	class RightEnvironment extends THREE.Group {
		constructor(index: number) {
			super();
			this.add(new RightEnvironmentObject(index, new THREE.Vector3(0, OBJECT_WIDTH / 2, 0)));
			this.translateX(TRACK_WIDTH + OBJECT_WIDTH);
		}
	}

	class EnvironmentObject extends THREE.Mesh {
		material: THREE.Material;
		constructor(index: number, position: THREE.Vector3, imgPath: string, width: number, height?: number) {
			var geometry: THREE.PlaneBufferGeometry = new THREE.PlaneBufferGeometry(width, height || OBJECT_WIDTH * 1.5);
			this.material = new THREE.MeshBasicMaterial({
				map: resources.textures.getValue(imgPath),
				transparent: true,
				side: THREE.FrontSide
			});

			super(geometry, this.material);
			this.position.set(position.x, position.y, position.z);
		}
	}

	class RoadEnvironmentObject extends EnvironmentObject {
		constructor(position: THREE.Vector3) {
			super(0, position, "archway1", TRACK_WIDTH * 5, TRACK_WIDTH * 3);
		}
	}

	class LeftEnvironmentObject extends EnvironmentObject {
		constructor(index: number, position: THREE.Vector3) {
			super(index, position, "left" + ++index, OBJECT_WIDTH * 1.5);
		}
	}

	class RightEnvironmentObject extends EnvironmentObject {
		constructor(index: number, position: THREE.Vector3) {
			super(index, position, "right" + ++index, OBJECT_WIDTH * 1.5);
		}
	}

}