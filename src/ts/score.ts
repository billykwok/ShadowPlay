/// <reference path="tsd/bundle.d.ts" />
/// <reference path="base.ts" />

declare module chrome.app.window {
	export interface Current {
		id: number;
		outerBounds: {
			setSize: (width: number, height: number) => void;
		};
	}
	export interface OnBoundsChangedEvent extends chrome.events.Event {
		addListener(callback: () => void): void;
	}
	var onBoundsChanged: OnBoundsChangedEvent;
	var current: () => Current;
}

class ScoreCounter {
	domElement: HTMLElement;
	score: number;
	onFinished: () => void;

	constructor(domElement: HTMLElement, onFinished: () => void) {
		this.score = 0;
		this.domElement = domElement;
		this.onFinished = onFinished;

		if (typeof this.domElement != "undefined") {
			this.domElement.setAttribute("style", "padding: 10px; font-size: 64px;");
		}
		this._updateDisplay();

		this.domElement.onclick = () => {
			chrome.app.window.current().outerBounds.setSize(window.screen.availWidth, window.screen.availHeight);
		};

		var finishScreen: HTMLImageElement = <HTMLImageElement> document.createElement("img");
		finishScreen.setAttribute("src", "img/first.png");
		finishScreen.setAttribute("width", "1024");
		finishScreen.setAttribute("height", "768");
		finishScreen.setAttribute("style", "position: fixed; left: 0; top: 0; z-index: 9; opacity: 0.9;");
		document.body.appendChild(finishScreen);
		setTimeout(() => {
			finishScreen.parentNode.removeChild(finishScreen);
		}, 2000);
	}

	private _updateDisplay(): void {
		if (this.score < 0) {
			this.score = 0;
		}
		if (this.score >= 10 && RunningElderly.mode === "market") {
			RunningElderly.mode = "grocery";
			var finishScreen: HTMLImageElement = <HTMLImageElement> document.createElement("img");
			finishScreen.setAttribute("src", "img/second.png");
			finishScreen.setAttribute("width", "1024");
			finishScreen.setAttribute("height", "768");
			finishScreen.setAttribute("style", "position: fixed; left: 0; top: 0; z-index: 9; opacity: 0.9;");
			document.body.appendChild(finishScreen);
			setTimeout(() => {
				finishScreen.parentNode.removeChild(finishScreen);
			}, 2000);
		} else if (this.score >= 20 && RunningElderly.mode === "grocery") {
			RunningElderly.mode = "cloth";
			var finishScreen: HTMLImageElement = <HTMLImageElement> document.createElement("img");
			finishScreen.setAttribute("src", "img/third.png");
			finishScreen.setAttribute("width", "1024");
			finishScreen.setAttribute("height", "768");
			finishScreen.setAttribute("style", "position: fixed; left: 0; top: 0; z-index: 9; opacity: 0.9;");
			document.body.appendChild(finishScreen);
			setTimeout(() => {
				finishScreen.parentNode.removeChild(finishScreen);
			}, 2000);
		} else if (this.score >= 30) {
			var finishScreen: HTMLImageElement = <HTMLImageElement> document.createElement("img");
			finishScreen.setAttribute("id", "finish-screen");
			finishScreen.setAttribute("src", "img/finish.png");
			finishScreen.setAttribute("width", "1024");
			finishScreen.setAttribute("height", "768");
			finishScreen.setAttribute("style", "position: fixed; left: 0; bottom: 0; z-index: 9;");
			document.body.appendChild(finishScreen);
			setTimeout(() => {
				finishScreen.parentNode.removeChild(finishScreen);
				this.onFinished();
			}, 5000);
		}
		this.domElement.innerHTML = this.score.toString();
	}

	getScore(): number {
		return this.score;
	}

	reset(): void {
		this.score = 0;
		this._updateDisplay();
	}

	increment(): void {
		++this.score;
		this._updateDisplay();
	}

	decrement(): void {
		--this.score;
		this._updateDisplay();
	}
}
