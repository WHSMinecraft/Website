var path = require('path');
var fs = require('fs');
var readline = require('readline');
var html = require('node-html-parser');



function parseData(path) {
	const content = fs.readFileSync(path, 'utf8');
	const dom = html.parse(content);

	const lines = content.split('\n').filter(Boolean);
	const data = {};

	const firstImg = dom.querySelector('img');
	if (firstImg) {
		data['image'] = firstImg.getAttribute('src');
	}

	let inMeta = false;
	for (line of lines) {
		if (line === '---') {
			inMeta = !inMeta;
			continue;
		}
		if (inMeta && line) {
			const key = line.split(':')[0].trim().toLowerCase();
			const value = line.split(':')[1].trim();
			data[key] = value;
			continue;
		}
	}

	return data;
}


var blog_list = fs.readdirSync(path.join(process.cwd(), "news_articles"), "utf8").map((blog_file, idx) => {
	const data = parseData(path.join(process.cwd(), "news_articles", blog_file));
	return {
		"url": blog_file,
		...data
	};
});

var view = {
	"blog_list": blog_list
}

console.debug(view);

module.exports = view;
