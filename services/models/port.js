var
	mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	ObjectId = Schema.ObjectId;

var portSchema = new Schema({
	name: String,
	country: {
		type: ObjectId,
		ref: 'Country'
	},
	costPerVolume: Number
});

var Port = mongoose.model('Port', portSchema, 'Port');

module.exports = Port;