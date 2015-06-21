/// <reference path="tsd/bundle.d.ts" />
/// <reference path="base.ts" />

module RunningElderly {
	export class RoadManager {
		scene: REScene;
		segmentIds: Array<number>;

		constructor(scene: REScene) {
			this.scene = scene;
			this.segmentIds = new Array();
		}

		animate = (keyboard: KeyboardState): void => {
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
			this.segmentIds.forEach((segmentId) => ++this.scene.getObjectById(segmentId).position.z);
		}
	}

	class RoadSegment extends THREE.Group {
		private roadTrackLeft: RoadTrackLeft;
		private roadTrackMiddle: RoadTrackMiddle;
		private roadTrackRight: RoadTrackRight;

		constructor() {
			super();
			this.roadTrackLeft = new RoadTrackLeft();
			this.add(this.roadTrackLeft);

			this.roadTrackMiddle = new RoadTrackMiddle();
			this.add(this.roadTrackMiddle);

			this.roadTrackRight = new RoadTrackRight();
			this.add(this.roadTrackRight);

			this.translateZ(- MAX_SEGMENT_NUMBER * SEGMENT_LENGTH);
		}
	}

	// abstract class
	class RoadTrack extends THREE.Group {
		constructor(material: THREE.Material) {
			super();
			var roadSurface: RoadSurface = new RoadSurface(material);
			this.add(roadSurface);
			for (var i = 0; i < 3; ++i) {
				if (Math.round(Math.random()))
					this.add(new RoadObstacle(Math.round(Math.random() * 2.5) * 2, roadSurface.position));
			}
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
		constructor() {
			super(new THREE.MeshBasicMaterial({
				color: new THREE.Color(Math.random() * 255, Math.random() * 255, Math.random() * 255).getHex(),
				side: THREE.DoubleSide
			}));
			this.translateX(TRACK_WIDTH);
		}
	}

	class RoadTrackMiddle extends RoadTrack {
		constructor() {
			super(new THREE.MeshBasicMaterial({
				color: new THREE.Color(Math.random() * 255, Math.random() * 255, Math.random() * 255).getHex(),
				side: THREE.DoubleSide
			}));
		}
	}

	class RoadTrackRight extends RoadTrack {
		constructor() {
			super(new THREE.MeshBasicMaterial({
				color: new THREE.Color(Math.random() * 255, Math.random() * 255, Math.random() * 255).getHex(),
				side: THREE.DoubleSide
			}));
			this.translateX(-TRACK_WIDTH);
		}
	}

	class RoadSurface extends THREE.Mesh {
		constructor(material: THREE.Material) {
			super(new THREE.PlaneBufferGeometry(TRACK_WIDTH, SEGMENT_LENGTH), material);
			this.rotateX(Math.PI / 2);
		}
	}

	class RoadObstacle extends THREE.Mesh {
		index: number;
		constructor(index: number, position: THREE.Vector3) {
			var geometry: THREE.PlaneBufferGeometry = new THREE.PlaneBufferGeometry(TRACK_WIDTH, TRACK_WIDTH);
			var material: THREE.Material = new THREE.MeshBasicMaterial({
				color: 0xffffff,
				transparent: true,
				opacity: 0.2,
				side: THREE.DoubleSide
			});
			super(geometry, material);
			this.position.set(position.x, position.y + TRACK_WIDTH * 0.5, position.z + index * TRACK_WIDTH - SEGMENT_LENGTH * 0.5);
		}
	}
}