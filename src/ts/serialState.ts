/// <reference path="tsd/bundle.d.ts" />
/// <reference path="base.ts" />

module RunningElderly {
	export class SerialState {

		constructor() {
			var id: number = 0;

			chrome.serial.getDevices((ports) => {
				for (var i = 0; i < ports.length; i++) {
					console.log(ports[i].path);
				}
			});
			chrome.serial.connect(, { bitrate: 115200 }, (info: chrome.serial.ConnectionInfo) => {
				console.log(info);
				id = info.connectionId;
			});
		}

		static 
	}
}