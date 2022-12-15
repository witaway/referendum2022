function countdownRedirect(url) {
	var redirectTimer = document.getElementById('timer');

	var cTicks = parseInt(redirectTimer.innerHTML);

	var timer = setInterval(function () {
		if (cTicks) {
			redirectTimer.innerHTML = --cTicks;
		} else {
			clearInterval(timer);
			location = url;
		}
	}, 1000);
}
