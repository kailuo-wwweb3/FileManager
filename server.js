var http = require('http');


var server = http.createServer(function(req, res) {
	switch (req.method) {
		case 'POST':
			req.setEncoding('utf8');
			req.on('data', function(chunk) {
				console.log('parsed', chunk);
			});
			req.on('end', function() {
				console.log('done parsing');
				res.end('OK\n');
			});
			break;

		case 'GET':
			break;

		case 'DELETE':

			break;
	}
});

server.listen(3000);