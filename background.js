chrome.app.runtime.onLaunched.addListener(function() {
	chrome.app.window.create('build/index.html', {
		state: 'fullscreen',
		'bounds': {
			'width': 1024 /*window.screen.availWidth*/,
			'height': 768 /*window.screen.availHeight*/
		}
	});
});