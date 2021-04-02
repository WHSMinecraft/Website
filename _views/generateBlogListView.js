#!/usr/bin/env node


var path = require('path');
var fs = require('fs');
var glob = require('glob');



glob('_views/tmp/news/*', {}, (err, files) => {
	var blog_list = files.map((blog_file, idx) => {
		const data = fs.readFileSync(blog_file, 'utf8');
		return JSON.parse(data);
	});


	// Order by creation date
	function dateStr2Date(str) {
		l = str.split('.').map(Number);
		return new Date(l[2], l[1]-1, l[0]);
	}
	blog_list.sort((a,b) => {
		return dateStr2Date(b.date) - dateStr2Date(a.date);
	});

	var view = {
		"blog_list": blog_list
	}


	console.log(JSON.stringify(view));
	module.exports = view;

});
