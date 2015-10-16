var
	Country = require('./models/Country'),
	Port = require('./models/Port'),
	ObjectUtil = require('../utils/objectUtil');

/**
 * Get Port by port._id
 * @param  {ObjectId}   id     _id of Port
 * @param  {Function} callback Callback function
 * @return {void}
 */
var getPortById = function getPortById(id, callback) {
	if (!id) {
		return callback(new Error('id is null'));
	}
	Port.findOne({
		_id: id
	}).populate('country').exec(function(err, port) {
		if (err) {
			return callback(err);
		}
		if (port) {
			callback(null, port);
		} else {
			return callback(new Error('Port is not exist'));
		}
	});
}

/**
 * Get Port by port.country._id
 * @param  {ObjectId}   id     _id of Port
 * @param  {Function} callback Callback function
 * @return {void}
 */
var getPortByCountry = function getPortByCountry(id, callback) {
	if (!id) {
		return callback(new Error('id is null'));
	}
	Port.find({
		country: id
	}).populate('country').exec(function(err, port) {
		if (err) {
			return callback(err);
		}
		if (port) {
			callback(null, port);
		} else {
			return callback(new Error('Port is not exist'));
		}
	});
}

/**
 * Get all port
 * @param  {Function} callback Callback function
 * @return {void}
 */
var getAllPort = function getAllPort(callback) {
	Port.find({}).populate('country').exec(function(err, ports) {
		if (err) {
			return callback(err);
		}
		if (ports) {
			callback(null, ports);
		} else {
			return callback(new Error('Ports is not exist'));
		}
	});
}

/**
 * Create a Port
 * @param  {Object}   port     Data of Port
 * @param  {Function} callback Callback function
 * @return {void}
 */
var createPort = function createPort(port, callback) {
	if (ObjectUtil.hasNull(port)) {
		return callback(new Error('Port data is not complete'));
	}
	Port.create(port, function(err, port) {
		if (err) {
			return callback(err);
		}
		callback(null, port);
	});
}

module.exports = {
	getPortById: getPortById,
	getPortByCountry: getPortByCountry,
	getAllPort: getAllPort,
	createPort: createPort
}