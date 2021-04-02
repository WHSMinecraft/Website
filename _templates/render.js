#!/usr/bin/env node

import "mustache";

var view = {
	  title: "Joe",
	  calc: function () {
		      return 2 + 4;
		    }
};

var output = Mustache.render("{{title}} spends {{calc}}", view);
