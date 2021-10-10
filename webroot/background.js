function getBlockComp(i, total) {
	if (i === 0)
		return ['grass_block_side'];
	if (i === 1)
		return ['dirt'];
	if (i === 2)
		return ['dirt', 'stone'];
	if (i === 3)
		return ['dirt', 'stone', 'stone', 'stone', 'stone', 'stone', 'stone'];
	if (i === total - 2)
		return ['stone', 'bedrock'];
	if (i === total - 1)
		return ['bedrock'];


	return [...Array(40).fill('stone'), 'coal_ore', 'coal_ore', 'gold_ore', 'emerald_ore', 'diamond_ore'];
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

	//const background = document.getElementById('background');
	for (let row = 0; row < rowAmount; row++) {
		const blockComp = getBlockComp(row, rowAmount);
		console.debug(blockComp);
		const rowElm = document.createElement('div');
		rowElm.classList.add('mc-block-row');

		for (let col = 0; col < colAmount; col++) {
			const blockType = blockComp[Math.floor(Math.random()*blockComp.length)]
			const blockElm = document.createElement('img');
			blockElm.classList.add('mc-block');
			blockElm.classList.add('pixel');
			blockElm.style.width  = blockWidth  + 'px';
			blockElm.style.height = blockHeight + 'px';
			blockElm.src = `/assets/block_textures/${blockType}.png`;

			blockElm.addEventListener('mousedown', function(e) {
				console.debug(e);
				const breakTexture = document.createElement('img');
				breakTexture.classList.add('mc-block-destroy');
				const origBlock = e.target;
				const origin = origBlock.getBoundingClientRect();
				console.debug(orgin);
			});

			rowElm.appendChild(blockElm);
		}

		background.appendChild(rowElm);
	}
	console.debug('Setted up background');
}

document.addEventListener('readystatechange', event => {
	if (event.target.readyState === 'complete') {
		setBackground();
	}
});
