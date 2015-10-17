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
	var volume, shippingCost, finalPrice, port, carsWithPrice = [];

	// find port -> find cars -> calculate price -> jsonp carsWithPrice
	async.series([
		function(callback) {
			// get port data
			PortService.getPortById(req.params.id, function(err, result) {
				if (err) {
					callback(err);
				} else {
					port = result;
					callback();
				}
			});
		},
		// then get all cars and calculate final price
		function(callback1) {
			CarService.getAllCar(function(err, cars) {
				if (err) {
					callback1(err);
				} else {
					async.eachLimit(cars, 20, function(car, callback2) {
						volume = FreightUtil.calCarVolume(car.specs.width, car.specs.length, car.specs.height);
						shippingCost = FreightUtil.calShippingCost(volume, port.costPerVolume);
						finalPrice = FreightUtil.calFinalPrice(car.fob, shippingCost);

						var carTmp = {
							_id: car._id,
							fob: car.fob,
							make: car.make,
							model: car.model,
							referenceNo: car.referenceNo,
							specs: car.specs,
							pricing: {
								port: port._id,
								volume: volume,
								shippingCost: shippingCost,
								finalPrice: finalPrice
							}
						}

						// doesn't work ...
						// car.pricing = {
						// 	port: port._id,
						// 	volume: volume,
						// 	shippingCost: shippingCost,
						// 	finalPrice: finalPrice
						// }
						carsWithPrice.push(carTmp);
						callback2();
					}, function(err) {
						if (err) {
							callback1(err);
						} else {
							carsWithPrice = _.sortBy(carsWithPrice, 'pricing.finalPrice');
							carsWithPrice = _.sortBy(carsWithPrice, function(item) {
								return -item.pricing.finalPrice;
							});
							callback1();
						}
					});
				}
			});
		},
	], function(err) {
		if (err) {
			return next(err);
		}
		res.jsonp(carsWithPrice);
	});

};