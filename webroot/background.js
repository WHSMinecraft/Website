function getBlockComp(i, total) {
	let pumpkin = i / (total - 1);

	pumpkin = Math.exp(-pumpkin);
	pumpkin -= (i / (total*2));
	if (pumpkin < 0)
		pumpkin = 0;
	let sand = 1 - pumpkin;
	pumpkin = Math.floor(25 * pumpkin);
	sand = Math.floor(25 * sand);

	const comp = [
		...Array(pumpkin).fill(['carved_pumpkin', 'pumpkin_side']).flat(),
		...Array(sand).fill('soul_sand')
	];
	if (i === total - 1)
		return ['cracked_polished_blackstone_bricks'];
	if (i === total - 2)
		return comp.map((e, i) => i%2 ? e : 'cracked_polished_blackstone_bricks');
	if (i === total - 3)
		return comp.map((e, i) => i%4 ? e : 'cracked_polished_blackstone_bricks');

	return comp;
}

function setBackground() {
	console.debug('Setting up background...');

	const background = document.createElement('div');
	background.id = 'background';
	document.body.appendChild(background);

	const body = document.body;
	const html = document.documentElement;

	const height = Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight);
	const width = document.documentElement.clientWidth;

	console.debug(height, width);

	const blockScale = 6;
	const blockHeight = 16 * blockScale;
	const blockWidth = 16 * blockScale;

	const rowAmount = Math.ceil(height / blockHeight);
	const colAmount = Math.ceil(width  / blockWidth);

	console.debug(rowAmount, colAmount);

	for (let row = 0; row < rowAmount; row++) {
		const blockComp = getBlockComp(row, rowAmount);
		console.debug(blockComp);
		const rowElm = document.createElement('div');
		rowElm.classList.add('mc-block-row');

		for (let col = 0; col < colAmount; col++) {
			const blockType = blockComp[Math.floor(Math.random()*blockComp.length)];
			const blockElm = document.createElement('img');
			blockElm.classList.add('mc-block');
			blockElm.classList.add('pixel');
			blockElm.style.width  = blockWidth  + 'px';
			blockElm.style.height = blockHeight + 'px';
			blockElm.src = `/assets/block_textures/${blockType}.png`;

			rowElm.appendChild(blockElm);
		}

		background.appendChild(rowElm);
	}
	console.debug('Set up background');
}

document.addEventListener('readystatechange', event => {
	if (event.target.readyState === 'complete') {
		setBackground();
	}
});
