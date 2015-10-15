var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

var makeSchema = new Schema({
	name: String
});

var Make = mongoose.model('Make', makeSchema, 'Make');

module.exports = Make;