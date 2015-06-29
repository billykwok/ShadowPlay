/// <reference path="tsd/bundle.d.ts" />
/// <reference path="base.ts" />

class ScoreCounter {
	domElement: HTMLElement;
	score: number;

	constructor(domElement: HTMLElement) {
		this.score = 0;
		this.domElement = domElement;
		if (typeof this.domElement != 'undefined') this.domElement.setAttribute('style', 'padding: 10px; font-size: 64px;');
		this._updateDisplay();
	}

	private _updateDisplay(): void {
		this.domElement.innerHTML = this.score.toString();
	}

	getScore(): number {
		return this.score;
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