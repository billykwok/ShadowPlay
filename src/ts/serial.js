/// <reference path="tsd/bundle.d.ts" />
/// <reference path="tsd/chrome.serial.d.ts" />
/// <reference path="base.ts" />
var RunningElderly;
(function (RunningElderly) {
    function ab2str(buf) {
        return String.fromCharCode.apply(null, new Uint8Array(buf));
    }
    var SerialState = (function () {
        function SerialState(onLineReceived) {
            var _this = this;
            this.id = 0;
            this.devicePath = "";
            this.strReceived = "";
            chrome.serial.getDevices(function (ports) {
                for (var i = 0; i < ports.length; ++i) {
                    if (ports[i].path.indexOf("/dev/cu.wch ch341") > -1 || ports[i].path.indexOf("COM3") > -1) {
                        console.log(ports[i].path);
                        _this.devicePath = ports[i].path;
                        break;
                    }
                }
                _this._onLineReceived = onLineReceived;
                _this.connect();
            });
        }
        SerialState.prototype.connect = function () {
            var _this = this;
            if (this.devicePath === "") {
                console.log("No device found!");
            }
            else {
                chrome.serial.connect(this.devicePath, { bitrate: 115200 }, function (info) {
                    console.log(info);
                    _this.id = info.connectionId;
                });
                chrome.serial.onReceive.addListener(function (info) {
                    if (info.connectionId == _this.id && info.data) {
                        var str = ab2str(info.data);
                        if (str.charAt(str.length - 1) === "\n") {
                            _this.strReceived += str.substring(0, str.length - 1);
                            _this._onLineReceived(_this.strReceived);
                            _this.strReceived = "";
                        }
                        else {
                            _this.strReceived += str;
                        }
                    }
                });
            }
        };
        return SerialState;
    })();
    RunningElderly.SerialState = SerialState;
})(RunningElderly || (RunningElderly = {}));
