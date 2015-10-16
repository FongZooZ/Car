'use strict'
var
	CarService = require('../services/carService'),
	CountryService = require('../services/countryService'),
	PortService = require('../services/portService');

var async = require('async');

exports.index = function(req, res, next) {
	var cars, countries, ports;
	async.parallel([
		function(callback) {
			CarService.getAllCar(function(err, results) {
				if (err) {
					callback(err);
				} else {
					cars = results;
					callback();
				}
			});
		},
		function(callback) {
			CountryService.getAllCountry(function(err, results) {
				if (err) {
					callback(err);
				} else {
					countries = results;
					callback();
				}
			})
		},
		function(callback) {
			PortService.getAllPort(function(err, results) {
				if (err) {
					callback(err);
				} else {
					ports = results;
					callback();
				}
			});
		}
	], function(err) {
		if (err) {
			return next(err);
		} else {
			res.render('index', {
				title: 'Car',
				cars: cars,
				countries: countries,
				ports: ports
			});
		}
	});
}