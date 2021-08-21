#!/usr/bin/env node


var path = require('path');
var fs = require('fs');
var glob = require('glob');



const filecontent = JSON.parse(fs.readFileSync('_views/bloglist.json', 'utf8'));

console.log(JSON.stringify(filecontent.blog_list[0], null, 4));
