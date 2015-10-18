var
	Car = require('./models/Car'),
	Port = require('./models/Port'),
	ObjectUtil = require('../utils/objectUtil'),
	PortService = require('./portService'),
	FreightUtil = require('../utils/freightUtil');

var
async = require('async');

/**
 * Get Car by car._id
 * @param  {ObjectId}   id     _id of Car
 * @param  {Function} callback Callback function
 * @return {void}
 */
var getCarById = function getCarById(id, callback) {
	if (!id) {
		return callback(new Error('id is null'));
	}
	Car.findOne({
		_id: id
	}).populate('make model').exec(function(err, car) {
		if (err) {
			return callback(err);
		}
		if (car) {
			callback(null, car);
		} else {
			return callback(new Error('Car does not exist'));
		}
	});
}

/**
 * Get all car
 * @param  {Function} callback Callback function
 * @return {void}
 */
var getAllCar = function getAllCar(callback) {
	Car.find({}).populate('make model').exec(function(err, car) {
		if (err) {
			return callback(err);
		}
		if (car) {
			callback(null, car);
		} else {
			return callback(new Error('Car does not exist'));
		}
	});
}

/**
 * Create a Car
 * @param  {Object}   car      Data of Car
 * @param  {Function} callback Callback function
 * @return {void}
 */
var createCar = function createCar(car, callback) {
	if (ObjectUtil.hasNull(car)) {
		return callback(new Error('Car data is not complete'));
	}
	Car.create(car, function(err, car) {
		if (err) {
			return callback(err);
		}
		callback(null, car);
	});
}

/**
 * // TODO: pagination
 * Get final price for all car for port
 * @param  {ObjectId}   id       id of port
 * @param  {Function} callback Callbackfunction
 * @return {void}
 */
var getPriceForPort = function getPriceForPort(id, callback) {
	if (!id) {
		return callback(new Error('id is null'));
	}
	PortService.getPortById(id, function(err, port) {
		if (err) {
			return callback(err);
		}
		if (port) {
			Car.aggregate({
				$project: {
					fob: 1,
					referenceNo: 1,
					make: 1,
					model: 1,
					specs: 1,
					pricing: {
						port: {
							$literal: port._id
						},
						volume: {
							$divide: [{
								$multiply: ["$specs.length", "$specs.height", "$specs.width"]
							}, 1000000000]
						},
						shippingCost: {
							$multiply: [{
								$divide: [{
									$multiply: ["$specs.length", "$specs.height", "$specs.width"]
								}, 1000000000]
							}, port.costPerVolume]
						},
						finalPrice: {
							$add: [{
								$multiply: [{
									$divide: [{
										$multiply: ["$specs.length", "$specs.height", "$specs.width"]
									}, 1000000000]
								}, port.costPerVolume]
							}, "$fob"]
						}
					}
				}
			}).sort('-pricing.finalPrice').exec(function(err, results) {
				if (err) {
					return callback(err);
				}
				Car.populate(results, {
					"path": "make model"
				}, function(err, results) {
					Port.populate(results, {
						"path": "pricing.port"
					}, function(err, results) {
						callback(null, results);
					});
				});
			});
		} else {
			return callback(new Error('Port does not exist'));
		}
	});
}

module.exports = {
	getCarById: getCarById,
	getAllCar: getAllCar,
	createCar: createCar,
	getPriceForPort: getPriceForPort
}