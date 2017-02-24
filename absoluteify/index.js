'use strict';

const assert = require('assert');
const trumpet = require('trumpet');
const partialRight = require('ap').partialRight;
const join = require('url-join');

function absoluteify (url) {
	assert(url, 'url is required');
	const tr = trumpet();
	tr.selectAll('img', partialRight(absolute, url, 'src'));
	tr.selectAll('script', partialRight(absolute, url, 'src'));
	tr.selectAll('link', partialRight(absolute, url, 'href'));
	
	return tr
}

let baseUrl = (url) => url.split("/").slice(0,3).join("/")+"/";

function isAbsolute(url) {
	if (typeof url !== 'string' || url == "") {
		return true;
		// throw new TypeError('Expected a string');
	}
	if(url.slice(0,2)=="//") return true;
	return /^[a-z][a-z0-9+.-]*:/.test(url);
}

function absolute (element, url, attribute) {
	element.setAttribute(
		attribute,
		(value) => value
			? isAbsolute(value)
				? value
				: value.charAt(0) === '/'
					? join(baseUrl(url), value)
					: join(url, value)
			: undefined
	)
}


module.exports = absoluteify;