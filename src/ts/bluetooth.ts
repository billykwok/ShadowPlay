/// <reference path="tsd/bundle.d.ts" />
/// <reference path="tsd/chrome.bluetooth.d.ts" />
/// <reference path="tsd/chrome.bluetoothSocket.d.ts" />
/// <reference path="base.ts" />

module RunningElderly {
	interface Connection {
		socketId: number;
		device: chrome.bluetooth.Device;
	}

	export class BluetoothManager {
		uuid: string;
		slider: Connection;
		wheel: Connection;

		onConnected = () => {
			if (chrome.runtime.lastError) {
				console.log("Connection failed: " + chrome.runtime.lastError.message);
			} else {
				// Profile implementation here.
			}
		};

		constructor() {
			this.uuid = '1105';

			chrome.bluetooth.getAdapterState(
				(adapter: chrome.bluetooth.AdapterState) => {
					console.log("Adapter " + adapter.address + ": " + adapter.name);
				}
			);

			var powered = false;
			chrome.bluetooth.getAdapterState(
				(adapter: chrome.bluetooth.AdapterState) => {
					powered = adapter.powered;
				}
			);

			chrome.bluetooth.onAdapterStateChanged.addListener(
				(adapter: chrome.bluetooth.AdapterState) => {
					if (adapter.powered != powered) {
						powered = adapter.powered;
						if (powered) console.log("Adapter radio is on");
						else console.log("Adapter radio is off");
					}
				}
			);

			chrome.bluetooth.onDeviceAdded.addListener((device) => {

			});
			chrome.bluetooth.onDeviceChanged.addListener((device) => {

			});
			chrome.bluetooth.onDeviceRemoved.addListener((device) => {

			});

			chrome.bluetooth.getDevices(
				(devices: Array<chrome.bluetooth.Device>) => {
					for (var i = 0; i < devices.length; ++i) {
						console.log(devices[i].address);
					}
				}
			);

			this._startDiscovery();
			this._socketInit();
		}

		private _socketInit(): void {
			// Slider Socket
			chrome.bluetoothSocket.create((info: chrome.bluetoothSocket.CreateInfo) => {
				chrome.bluetoothSocket.connect(info.socketId, this.slider.device.address, this.uuid, this.onConnected);
			});

			// Wheel Socket
			chrome.bluetoothSocket.create((info: chrome.bluetoothSocket.CreateInfo) => {
				chrome.bluetoothSocket.connect(info.socketId, this.wheel.device.address, this.uuid, this.onConnected);
			});
		}

		private _startDiscovery(): void {
			chrome.bluetooth.startDiscovery(() =>
				setTimeout(() => {
					chrome.bluetooth.stopDiscovery();
				}, 30000)
			);
		}
		
		connect(): void {
			
		}

		stop(): void {
			chrome.bluetoothSocket.disconnect(this.wheel.socketId);
			chrome.bluetoothSocket.disconnect(this.slider.socketId);
		}

	}
}