'use strict';

const { readdirSync } = require('fs');
const path = require('path');
const handlebars = require('handlebars');
const PATH_TRANSFORMS = path.join(__dirname, '../transforms');

readdirSync(PATH_TRANSFORMS)
	.forEach((file) => {
		const ext = path.extname(file);
		const name = path.basename(file, ext);
		const helperPath = path.join(PATH_TRANSFORMS, file);
		const helper = require(helperPath);
		handlebars.registerHelper(name, helper);
	});
	