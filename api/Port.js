'use strict'

var PortService = require('../services/portService');

exports.getPortByCountry = function(req, res, next) {
	PortService.getPortByCountry(req.params.id, function(err, results) {
		if (err) {
			return next(err);
		}
		res.jsonp(results);
	});
};

exports.getAllPort = function(req, res, next) {
	PortService.getAllPort(function(err, results) {
		if (err) {
			return next(err);
		}
		res.jsonp(results);
	});
}