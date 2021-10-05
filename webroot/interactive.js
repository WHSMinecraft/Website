// add this script
// add <div id="tooltip-anchor"></div> to body
// add 'data-tooltip="Content of the tooltip"' to elmeents of your choice
// call updateTooltips() everytime the above attribute (or elements containing it) are added
// the other function are exposed for manual control

function showTooltip(content, origin) {
	const anchor = document.getElementById('tooltip-anchor');
	let t;
	if (anchor.hasChildNodes()) {
		t = anchor.children[0];
	} else {
		t = document.createElement('div');
		t.classList.add('mc-tooltip');
		anchor.appendChild(t);
	}
	t.innerText = content;

	function setPos(x, y) {
		t.style.top = y + 'px';
		t.style.left = x + 'px';
	}

	if (isTouch()) {
		// Tooltip is placed centered on top of origin, and stays there
		t.classList.add('mc-tooltip-element');
		const rectRoot = origin.getBoundingClientRect();
		const rectTip = t.getBoundingClientRect();

		const marginTip = 5;
		let y = rectRoot.top + scrollY - marginTip - rectTip.height;
		let x = (rectRoot.width / 2 + rectRoot.left) - (rectTip.width / 2);
		// move to right or left to prevent tooltip overflowing out of screen
		if (x < 0)
			x = marginTip;
		if (x + rectTip.width > screen.width)
			x = screen.width - rectTip.width - marginTip;
		setPos(x, y);
	} else {
		// Tooltip follows mouse
		t.classList.add( 'mc-tooltip-mouse');
		document.body.addEventListener('mousemove', function(e) {
			setPos(e.clientX + 15, e.clientY - 15);
		});
		const e = window.event;
		if (e && e.type === 'click') {
			setPos(e.clientX + 15, e.clientY - 15);
		}
	}
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
