var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	ObjectId = Schema.ObjectId;

var carSchema = new Schema({
	referenceNo: String,
	make: {
		type: Schema.ObjectId,
		ref: 'Make'
	},
	model: {
		type: Schema.ObjectId,
		ref: 'Model'
	},
	fob: Number,
	width: Number,
	length: Number,
	height: Number
});

var Car = mongoose.model('car', carSchema,'car');

module.exports = Car;