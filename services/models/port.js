var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	ObjectId = Schema.ObjectId;

var portSchema = new Schema({
	name: String,
	country: {
		type: ObjectId,
		ref: 'Country'
	},
	cost: Number
});

var Port = mongoose.model('port', portSchema, 'port');

module.exports = Port;