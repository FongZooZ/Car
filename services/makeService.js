var
	Make = require('./models/Make'),
	ModelService = require('./modelService');

/**
 * Get Make by make._id
 * @param  {ObjectId}	id       _id of Make
 * @param  {Function} callback Callback function
 * @return {void}
 */
var getMakeById = function getMakeById(id, callback) {
	if (!id) {
		return callback(new Error('id is null'));
	}
	Make.findOne({
		_id: id
	}, function(err, make) {
		if (err) {
			return callback(err);
		}
		if (make) {
			callback(null, make);
		} else {
			callback(new Error('Make does not exit'));
		}
	});
}

/**
 * Get Make by make.name
 * @param  {ObjectId}	id       _id of Make
 * @param  {Function} callback Callback function
 * @return {void}
 */
var getMakeByName = function getMakeByName(name, callback) {
	if (!name) {
		return callback(new Error('name is null'));
	}
	Make.findOne({
		name: name
	}, function(err, make) {
		if (err) {
			return callback(err);
		}
		if (make) {
			callback(null, make);
		} else {
			callback(new Error('Make does not exit'));
		}
	});
}

/**
 * Get Make by model.name
 * @param  {String}   name     Model name
 * @param  {Function} callback Callback function
 * @return {void}
 */
var getMakeByModelName = function getMakeByModelName(name, callback) {
	if (name) {
		return callback(new Error('name is null'));
	}
	ModelService.getModelByName(name, function(err, model) {
		if (err) {
			return callback(err);
		}
		if (!model) {
			return callback(new Error('Model does not exist'));
		} else {
			getMakeById(model._id, function(err, make) {
				if (err) {
					return callback(err);
				}
				if (make) {
					callback(null, make);
				} else {
					return callback(new Error('Make does not exist'))
				}
			});
		}
	});
}

/**
 * Create a Make
 * @param  {Object}   make     Data of Make
 * @param  {Function} callback Callback function
 * @return {void}
 */
var createMake = function createMake(make, callback) {
	if (!make.name) {
		return callback(new Error('Make is null'));
	}
	Make.create(make, function(err, make) {
		if (err) {
			return callback(err);
		}
		callback(null, make);
	});
}

module.exports = {
	getMakeById: getMakeById,
	getMakeByName: getMakeByName,
	getMakeByModelName: getMakeByModelName,
	createMake: createMake
}