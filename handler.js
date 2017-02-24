'use strict';

const scrapper = require('./scraper');
const absoluteify = require('./absoluteify');
const stream = require('stream');


function respond (statusCode, body, callback) {
	
	const response = {
		statusCode: statusCode,
		headers: {
			'Content-Type': 'text/html',
			'X-Requested-With': '*',
			'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Requested-With',
			'Access-Control-Allow-Origin': '*',
			'Access-Control-Allow-Methods': 'GET,OPTIONS'
		},
		body: body,
	};
	callback(null, response);
}

module.exports.scrape = (event, context, callback) => {
	process.env['PATH'] = process.env['PATH'] + ':' + process.env['LAMBDA_TASK_ROOT'];
	
	let q = event.queryStringParameters || {};
	
	if (q.url) {
		
		q.url = decodeURIComponent(q.url);
		
		console.log("start scraping ",q.url);
		scrapper.scrape(q.url, function(err, result) {
	    if (err) {
        return respond(400, 'error: '+err, callback);
	    }
			
	    //modify refs in html source
			let s = new stream.Readable();
			s._read = function noop() {};
			s.push(result);
			s.push(null);
			
			s = s.pipe(absoluteify(q.url));
			
			let results = "";
			s.on('data', function (data) {
				results += data.toString();
			});
			s.on('end', function() {
				return respond(200, results, callback);
			})
			
		})
	}
	else {
		return respond(400, 'error: bad query', callback);
	}
};