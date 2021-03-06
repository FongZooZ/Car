var
	Model = require('./models/Model'),
	ObjectUtil = require('../utils/objectUtil');

/**
 * Get Model by model._id
 * @param  {ObjectId}   id     _id of Model
 * @param  {Function} callback Callback function
 * @return {void}
 */
var getModelById = function getModelById(id, callback) {
	if (!id) {
		return callback(new Error('id is null'));
	}
	Model.findOne({
		_id: id
	}).populate('make').exec(function(err, model) {
		if (err) {
			return callback(err);
		}
		if (model) {
			callback(null, model);
		} else {
			return callback(new Error('Model does not exist'));
		}
	});
}

/**
 * Get Model by model.name
 * @param  {String}   name     Model name
 * @param  {Function} callback Callback function
 * @return {void}
 */
var getModelByName = function getModelByName(name, callback) {
	if (!name) {
		return callback(new Error('name is null'));
	}
	Model.findOne({
		name: name
	}, function(err, model) {
		if (err) {
			return callback(err);
		}
		if (model) {
			callback(null, model);
		} else {
			return callback(new Error('Model does not exist'));
		}
	})
}

/**
 * Create a Model
 * @param  {Object}   model    Data of Model
 * @param  {Function} callback Callback function
 * @return {void}
 */
var createModel = function createModel(model, callback) {
	if (ObjectUtil.hasNull(model)) {
		return callback(new Error('Model is not complete'));
	}
	Model.create(model, function(err, model) {
		if (err) {
			return callback(err);
		}
		callback(null, model);
	});
}

module.exports = {
	getModelById: getModelById,
	getModelByName: getModelByName,
	createModel: createModel
}