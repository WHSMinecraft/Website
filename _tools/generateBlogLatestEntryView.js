#!/usr/bin/env node


const fs = require('fs');


const filecontent = JSON.parse(fs.readFileSync('_views/bloglist.json', 'utf8'));

console.log(JSON.stringify(filecontent.blog_list[0], null, 4));
