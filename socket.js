var io = require('socket.io');

var cradle = require('cradle'),
 	c = new(cradle.Connection)('localhost', 5984, {
	    cache: false,
	    raw: false
	});
	db = c.database('collected');

exports.boot = function(app){
    bootSocket(app);
};

function bootSocket(app) {
	var socket = io.listen(app);
	socket.on('connection', function(client) {
		client.broadcast(JSON.stringify({ connected: client.sessionId }));
		bootClient(app, client);
	});
};

function bootClient(app, client) {
	client.on('message', function(data) {
		var msg = JSON.parse(data);
		if (msg.position) {
			client.broadcast(JSON.stringify({ 
				position: {
					data: {
						'user': client.sessionId, 
						'message': msg
					}
				}
			}));
		} else if (msg.collected) {
			db.get('amount', function(er, doc) {
				var collected = doc.value;
				var rev = doc._rev;
				collected++;
				db.save('amount', rev, {
					value: collected
				}, function(err, res) {
				    client.broadcast(JSON.stringify({ 
						collected: {
							data: {
								'amount': collected
							}
						}
					}));
				})
			});
		}
	});
	client.on('disconnect', function() {
		client.broadcast(JSON.stringify({ disconnected: client.sessionId }));
	});
};
