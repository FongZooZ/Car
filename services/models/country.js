var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

var countrySchema = new Schema({
	name: String
});

var Country = mongoose.model('Country', countrySchema, 'Country');

module.exports = Country;