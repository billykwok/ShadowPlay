/// <reference path="tsd/bundle.d.ts" />
/// <reference path="base.ts" />

module RunningElderly {
	var marketRewardImg: Array<string> = ["carrot", "paprika", "egg", "eggplant", "tomato"];
	var groceryRewardImg: Array<string> = ["basin", "fan", "stool", "thermos", "towel"];
	var clothRewardImg: Array<string> = ["clothes", "hat", "scarf", "shose", "trouser"];

	export class RoadManager {
		scene: REScene;
		segmentIds: Array<number>;

		constructor(scene: REScene) {
			this.scene = scene;
			this.segmentIds = new Array();
		}

		getObstacle(id: string): RoadObstacle {
			return <RoadObstacle> this.scene.getObjectById(id);
		}

		getAllObstacles(): Array<RoadObstacle> {
			var obstacles = new Array<RoadObstacle>();
			this.segmentIds.forEach((segmentId) => {
				this.scene.getObjectById(segmentId).children.forEach((track) => {
					track.children.forEach((obj) => {
						if (obj instanceof RoadObstacle) {
							obstacles.push(obj);
						}
					});
				});
			});
			return obstacles;
		}

		animate = (keyboard: KeyboardState, speed: number): void => {
			if (this.segmentIds.length == 0) {
				var roadSegment = new RoadSegment();
				this.segmentIds.push(roadSegment.id);
				this.scene.add(roadSegment);
			}
			if (this.scene.getObjectById(this.segmentIds[0]).position.z >= SEGMENT_LENGTH) {
				this.scene.removeObjectById(this.segmentIds[0]);
				this.segmentIds = this.segmentIds.slice(1, this.segmentIds.length);
			}
			if (this.segmentIds.length <= MAX_SEGMENT_NUMBER &&
				this.scene.getObjectById(this.segmentIds[this.segmentIds.length - 1]).position.z >= - (MAX_SEGMENT_NUMBER - 1) * SEGMENT_LENGTH) {
				var roadSegment = new RoadSegment();
				this.segmentIds.push(roadSegment.id);
				this.scene.add(roadSegment);
			}
			this.segmentIds.forEach((segmentId) => this.scene.getObjectById(segmentId).position.z += speed);
		};
	}

	class RoadSegment extends THREE.Group {
		private roadTrackLeft: RoadTrackLeft;
		private roadTrackMiddle: RoadTrackMiddle;
		private roadTrackRight: RoadTrackRight;

		constructor() {
			super();
			var arr: Array<number> = new Array<number>();
			while (arr.length < 3) {
				var randomnumber: number = Math.round(Math.random() * 2.5) * 2;
				var found: boolean = false;
				for (var i = 0; i < arr.length; ++i) {
					if (arr[i] == randomnumber) { found = true; break; }
				}
				if (!found) {
					arr[arr.length] = randomnumber;
				}
			}

			this.roadTrackLeft = new RoadTrackLeft(arr[0]);
			this.add(this.roadTrackLeft);

			this.roadTrackMiddle = new RoadTrackMiddle(arr[1]);
			this.add(this.roadTrackMiddle);

			this.roadTrackRight = new RoadTrackRight(arr[2]);
			this.add(this.roadTrackRight);

			this.translateZ(- MAX_SEGMENT_NUMBER * SEGMENT_LENGTH);
		}
	}

	// abstract class
	class RoadTrack extends THREE.Group {
		constructor(obstaclePosition: number) {
			super();
			var roadSurface: RoadSurface = new RoadSurface();
			this.add(roadSurface);
			this.add(Math.random() >= 0.5 ?
				new RewardObstacle(obstaclePosition, roadSurface.position) :
				new TrapObstacle(obstaclePosition, roadSurface.position));
		}

		addObstacle(obstacle: RoadObstacle): void {
			this.add(obstacle);
		}

		addObstacles(obstacles: Array<RoadObstacle>): void {
			obstacles.forEach((obs) => this.add(obs));
		}

		removeObstacle(obstacle: RoadObstacle): void {
			this.remove(obstacle);
		}
	}

	class RoadTrackLeft extends RoadTrack {
		constructor(obstaclePosition: number) {
			super(obstaclePosition);
			this.translateX(TRACK_WIDTH);
		}
	}

	class RoadTrackMiddle extends RoadTrack {
		constructor(obstaclePosition: number) {
			super(obstaclePosition);
		}
	}

	class RoadTrackRight extends RoadTrack {
		constructor(obstaclePosition: number) {
			super(obstaclePosition);
			this.translateX(-TRACK_WIDTH);
		}
	}

	class RoadSurface extends THREE.Mesh {
		constructor() {
			var geometry: THREE.PlaneBufferGeometry = new THREE.PlaneBufferGeometry(TRACK_WIDTH, SEGMENT_LENGTH);
			var material: THREE.MeshBasicMaterial = new THREE.MeshBasicMaterial({
				transparent: true,
				opacity: 0,
				side: THREE.FrontSide
			});
			super(geometry, material);
			this.rotateX(Math.PI / 2);
		}
	}

	export class RoadObstacle extends THREE.Mesh {
		constructor(index: number, position: THREE.Vector3, imgPath: string) {
			var geometry: THREE.PlaneBufferGeometry = new THREE.PlaneBufferGeometry(TRACK_WIDTH / 2, TRACK_WIDTH / 2);
			var material: THREE.Material = new THREE.MeshBasicMaterial({
				map: resources.textures.getValue(imgPath),
				transparent: true,
				side: THREE.FrontSide
			});

			super(geometry, material);
			this.position.set(position.x, position.y + TRACK_WIDTH * 0.5, position.z + index * TRACK_WIDTH - SEGMENT_LENGTH * 0.5);
		}
	}

	export class RewardObstacle extends RoadObstacle {
		constructor(index: number, position: THREE.Vector3) {
			if (mode === "market") {
				super(index, position, marketRewardImg[Math.floor(Math.random() * marketRewardImg.length)]);
			} else if (mode === "grocery") {
				super(index, position, groceryRewardImg[Math.floor(Math.random() * groceryRewardImg.length)]);
			} else if (mode === "cloth") {
				super(index, position, clothRewardImg[Math.floor(Math.random() * clothRewardImg.length)]);
			}
		}
	}

	export class TrapObstacle extends RoadObstacle {
		constructor(index: number, position: THREE.Vector3) {
			super(index, position, "insect");
		}
	}

}