var cradle = require('cradle'),
 	c = new(cradle.Connection)('localhost', 5984, {
	    cache: false,
	    raw: false
	});
	db = c.database('collected');


module.exports = {
    index: function(request, response){
		var doc = db.get('amount', function(er, doc) {
	 		response.render({ amount: doc.value });
		});
    }
};