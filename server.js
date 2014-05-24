var http = require('http');
var formidable = require('formidable');
var fs = require('fs');
var mime = require('mime');
var path = require('path');
var cache = {};

var server = http.createServer(function(req, res) {
	var filePath = false;

	if (req.url == '/') {
		filePath = 'ui/index.html';
	} else {
		filePath = 'ui' + req.url
	}
	var absPath = './' + filePath;
	serveStatic(res, cache, absPath);

	switch (req.method) {
		case 'POST':
			upload(req, res);
			break;

		case 'GET':
			break;

		case 'DELETE':

			break;
	}
});

server.listen(3000);

function upload(req, res) {
	if (!isFormData(req)) {
		res.statusCode = 400;
		res.end('Bad request: expecting multipart/form-data');
		return;
	}
	var form = new formidable.IncomingForm();
	form.on('field', function(field, value) {
		console.log(field);
		console.log(value);
	});
	form.on('file', function(name, file) {
		console.log(name);
		console.log(file);
	});
	form.on('end', function() {
		res.end('upload complete;');
	});
	form.parse(req);
}

function isFormData(req) {
	var type = req.headers['content-type'] || '';
	return 0 == type.indexOf('multipart/form-data');
}

function send404(response) {
	response.writeHead(404, {'Content-Type': 'text/plain'});
	response.write('Error 404: resource not found');
	response.end();
}

function sendFile(response, filePath, fileContents) {
	response.writeHead(
		200,
		{"Content-Type": mime.lookup(path.basename(filePath))}
	);
	response.end(fileContents);
}

function serveStatic(response, cache, absPath) {
	if (cache[absPath]) {
		sendFile(response, absPath, cache[absPath]);
	} else {
		fs.exists(absPath, function(exists) {
			if (exists) {
				fs.readFile(absPath, function(err, data) {
					if (err) {
						send404(response);
					} else {
						cache[absPath] = data;
						sendFile(response, absPath, data);
					}
				});
			} else {
				send404(response);
			}
		});
	}
}