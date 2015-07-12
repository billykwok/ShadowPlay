/// <reference path="tsd/bundle.d.ts" />
/// <reference path="tsd/chrome.serial.d.ts" />
/// <reference path="base.ts" />

module RunningElderly {
	function ab2str(buf: ArrayBuffer): string {
		return String.fromCharCode.apply(null, new Uint8Array(buf));
	}

	export class SerialState {
		id: number;
		devicePath: string;
		strReceived: string;

		private _onLineReceived: (str: string) => void;

		constructor(onLineReceived: (str: string) => void) {
			this.id = 0;
			this.devicePath = "";
			this.strReceived = "";

			chrome.serial.getDevices((ports) => {
				for (var i = 0; i < ports.length; ++i) {
					if (ports[i].path.indexOf("/dev/cu.wch ch341") > -1 || ports[i].path.indexOf("COM") > -1) {
						console.log(ports[i].path);
						this.devicePath = ports[i].path;
						break;
					}
				}
				this._onLineReceived = onLineReceived;
				this.connect();
			});
		}

		connect(): void {
			if (this.devicePath === "") {
				console.log("No device found!");
			} else {
				chrome.serial.connect(this.devicePath, { bitrate: 115200 }, (info: chrome.serial.ConnectionInfo) => {
					console.log(info);
					this.id = info.connectionId;
				});

				chrome.serial.onReceive.addListener((info) => {
					if (info.connectionId == this.id && info.data) {
						var str = ab2str(info.data);
						if (str.charAt(str.length - 1) === "\n") {
							this.strReceived += str.substring(0, str.length - 1);
							this._onLineReceived(this.strReceived);
							this.strReceived = "";
						} else {
							this.strReceived += str;
						}
					}
				});
			}
		}
	}
}
