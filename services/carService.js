var Car = require('./models/Car');
var ObjectUtil = require('../utils/objectUtil');

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

module.exports = {
	getCarById: getCarById,
	createCar: createCar
}