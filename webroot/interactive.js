// add this script
// add <div id="tooltip-anchor"></div> to body
// add 'data-tooltip="Content of the tooltip"' to elmeents of your choice
// call updateTooltips() everytime the above attribute (or elements containing it) are added
// the other function are exposed for manual control

function showTooltip(content, origin /* optional */) {
	const anchor = document.getElementById('tooltip-anchor');
	if (anchor.hasChildNodes())
		removeTooltip();
	const t = document.createElement('div');
	t.classList.add('mc-tooltip');
	t.innerHTML = content;
	anchor.appendChild(t);

	function setPos(x, y) {
		t.style.top = (-15 + y) + 'px';
		t.style.left = (15 + x) + 'px';
	}

	// Set initial pos to element when using touch screen device
	if (isTouch()) {
		const rect = origin.getBoundingClientRect();
		setPos(rect.x, rect.y);
	}

	document.body.addEventListener('mousemove', function(e) {
		setPos(e.clientX, e.clientY);
	});
}

function removeTooltip() {
	const anchor = document.getElementById('tooltip-anchor');
	anchor.innerHTML = '';
}

let tooltipfadetimer;

function fadeTooltipIn(ms) {
	clearTimeout(tooltipfadetimer);
	tooltipfadetimer = setTimeout(_fadeTooltip, ms);
}

function _fadeTooltip() {
	const anchor = document.getElementById('tooltip-anchor');
	const tooltip = anchor.children[0];
	tooltip.style.opacity = 0;
	setTimeout(removeTooltip, 1000);
}

function updateTooltips() {
	const tooltipElms = document.querySelectorAll('[data-tooltip]');
	if (isTouch()) {
		tooltipElms.forEach((elm) => {
			elm.addEventListener('touchstart', function() {
				showTooltip(elm.getAttribute('data-tooltip'), elm);
				fadeTooltipIn(2000);
			});
		});
	} else { // mouse
		tooltipElms.forEach((elm) => {
			elm.addEventListener('mouseenter', function() {
				showTooltip(elm.getAttribute('data-tooltip'), elm);
			});
			elm.addEventListener('mouseleave', function() {
				removeTooltip();
			});
		});
	}
}

function isTouch() {
	return 'ontouchstart' in window || navigator.msMaxTouchPoints;
}

function setClipboard(text) {
	const t = document.createElement('textarea');
	t.innerText = text;
	document.body.appendChild(t);
	t.select();
	document.execCommand('copy');
	document.body.removeChild(t);
}
