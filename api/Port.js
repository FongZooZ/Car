'use strict'

var
	PortService = require('../services/portService'),
	CountryService = require('../services/countryService'),
	CarService = require('../services/carService'),
	FreightUtil = require('../utils/freightUtil');

var
async = require('async'),
	_ = require('underscore');

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

exports.calculateFinalPrice = function(req, res, next) {
	CarService.getPriceForPort(req.params.id, function(err, cars) {
		if (err) {
			return next(err);
		}
		res.jsonp(cars);
	});
};