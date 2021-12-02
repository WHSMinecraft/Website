#!/usr/bin/env node

const process = require('process');
const path = require('path');
const fs = require('fs');
const html = require('node-html-parser');



function parseData(path) {
	const filecontent = fs.readFileSync(path, 'utf8');
	const dom = html.parse(filecontent);

	const lines = filecontent.split('\n').filter(Boolean);
	const data = {};
	data['content'] = '';

	// Find first image and use it as a thumbnail
	const firstImg = dom.querySelector('img');
	if (firstImg) {
		data['thumbnail'] = firstImg.getAttribute('src');
	}

	// Find first text node and use it as a preview/description
	const firstText = dom.querySelector('p');
	if (firstText) {
		data['description'] = firstText.structuredText;
	}

	// Metadata can be specified in between blocks of "---"
	let inMeta = false;
	for (const line of lines) {
		if (line === '---') {
			inMeta = !inMeta;
			continue;
		}
		if (inMeta && line) {
			const key = line.split(':')[0].trim().toLowerCase();
			const value = line.split(':').slice(1).join(':').trim();
			data[key] = value;
			continue;
		}
		if (!inMeta) {
			data['content'] += line;
		}
	}

	return data;
}


function makeReadable(str) {
	return str.split('_').map(s => s[0].toUpperCase() + s.slice(1)).join(' ');
}

const blog_file_path = process.argv[2];
let blog_file = path.basename(blog_file_path);
blog_file = blog_file.replace(path.extname(blog_file), '');

const stat = fs.statSync(blog_file_path);
let viewdata = {};
viewdata['date'] = stat.birthtime.toLocaleDateString('de-DE');
viewdata['url'] = '/news/' + blog_file + '/';
viewdata['title'] = makeReadable(blog_file);

viewdata = {
	...viewdata,
	...parseData(blog_file_path)
};


// print only result to console, for use in shell redirection
console.log(JSON.stringify(viewdata, null, 4));

module.exports = viewdata;
