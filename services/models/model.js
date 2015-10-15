var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	ObjectId = Schema.ObjectId;

var modelSchema = new Schema({
	name: String,
	make: {
		type: Schema.ObjectId,
		ref: 'Make'
	}
});

var Model = mongoose.model('Model', modelSchema, 'Model');

module.exports = Model;