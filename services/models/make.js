var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

var makeSchema = new Schema({
	name: String
});

var Make = mongoose.model('make', makeSchema, 'make');

module.exports = Make;