var
	mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	ObjectId = Schema.ObjectId,
	Make = require('./Make'),
	Model = require('./Model');

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
	specs: {
		width: Number,
		length: Number,
		height: Number
	}
});

var Car = mongoose.model('Car', carSchema, 'Car');

module.exports = Car;