var Country = require('./models/Country');
var ObjectUtil = require('../utils/objectUtil');

/**
 * Get Country by country._id
 * @param  {ObjectId}   id     _id of Country
 * @param  {Function} callback Callback function
 * @return {void}
 */
var getCountryById = function getCountryById(id, callback) {
	if (!id) {
		return callback(new Error('id is null'));
	}
	Country.find({
		_id: id
	}, function(err, country) {
		if (err) {
			return callback(err);
		}
		if (country) {
			callback(null, country);
		} else {
			return callback(new Error('Country does not exist'));
		}
	});
}

/**
 * Get Country by country.name
 * @param  {String}   name   Name of port
 * @param  {Function} callback Callback function
 * @return {void}
 */
var getCountryByName = function getCountryByName(name, callback) {
	if (!name) {
		return callback(new Error('name is null'));
	}
	Country.findOne({
		name: name
	}, function(err, country) {
		if (err) {
			return callback(err);
		}
		if (country) {
			callback(null, country);
		} else {
			return callback(new Error('Country does not exist'));
		}
	});
}

/**
 * Create a Country
 * @param  {Object}   country  Data of country
 * @param  {Function} callback Callback function
 * @return {void}
 */
var createCountry = function createCountry(country, callback) {
	if (!country.name) {
		return callback(new Error('Country name is null'));
	}
	Country.create(country, function(err, country) {
		if (err) {
			return callback(err);
		}
		callback(null, country);
	});
}

module.exports = {
	getCountryById: getCountryById,
	getCountryByName: getCountryByName,
	createCountry: createCountry
}