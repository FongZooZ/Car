var Make = require('./models/Make');

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
	createMake: createMake
}