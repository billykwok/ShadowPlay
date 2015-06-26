chrome.app.runtime.onLaunched.addListener(function() {
	chrome.app.window.create('build/index.html', {
		state: 'fullscreen',
		'bounds': {
			'width': window.screen.availWidth,
			'height': window.screen.availHeight
		}
	});
});