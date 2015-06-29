/// <reference path="collections.ts" />

class KeyboardState {
	static k = {
		8: "backspace", 9: "tab", 13: "enter", 16: "shift",
		17: "ctrl", 18: "alt", 27: "esc", 32: "space",
		33: "pageup", 34: "pagedown", 35: "end", 36: "home",
		37: "left", 38: "up", 39: "right", 40: "down",
		45: "insert", 46: "delete", 186: ";", 187: "=",
		188: ",", 189: "-", 190: ".", 191: "/",
		219: "[", 220: "\\", 221: "]", 222: "'"
	};
	static status = {};

	constructor() {
		document.addEventListener("keydown", KeyboardState.onKeyDown, false);
		document.addEventListener("keyup", KeyboardState.onKeyUp, false);
	}

	static keyName(keyCode) {
		return (KeyboardState.k[keyCode] != null) ?
			KeyboardState.k[keyCode] :
			String.fromCharCode(keyCode);
	}

	static onKeyUp(event) {
		var key = KeyboardState.keyName(event.keyCode);
		if (KeyboardState.status[key])
			KeyboardState.status[key].pressed = false;
	}

	static onKeyDown(event) {
		var key = KeyboardState.keyName(event.keyCode);
		if (!KeyboardState.status[key])
			KeyboardState.status[key] = { down: false, pressed: false, up: false, updatedPreviously: false };
	}

	update() {
		for (var key in KeyboardState.status) {
			// insure that every keypress has "down" status exactly once
			if (!KeyboardState.status[key].updatedPreviously) {
				KeyboardState.status[key].down = true;
				KeyboardState.status[key].pressed = true;
				KeyboardState.status[key].updatedPreviously = true;
			}
			else // updated previously
			{
				KeyboardState.status[key].down = false;
			}

			// key has been flagged as "up" since last update
			if (KeyboardState.status[key].up) {
				delete KeyboardState.status[key];
				continue; // move on to next key
			}

			if (!KeyboardState.status[key].pressed) // key released
				KeyboardState.status[key].up = true;
		}
	}

	down(keyName) {
		return (KeyboardState.status[keyName] && KeyboardState.status[keyName].down);
	}

	pressed(keyName) {
		return (KeyboardState.status[keyName] && KeyboardState.status[keyName].pressed);
	}

	up(keyName) {
		return (KeyboardState.status[keyName] && KeyboardState.status[keyName].up);
	}
}