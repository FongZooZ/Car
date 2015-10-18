var
	CarService = require('../services/carService'),
	Car = require('../services/models/Car');

exports.calculateFinalPrice = function(req, res, next) {
	CarService.getPriceForPort(req.params.id, function(err, cars) {
		if (err) {
			return next(err);
		}
		res.jsonp(cars);
	});
};

exports.getCarPagination = function(req, res, next) {
	CarService.getCarPagination(req.params.currentPage, req.params.pageSize, function(err, results) {
		if (err) {
			return next(err);
		}
		res.jsonp(results);
	});
};

exports.getAllPricePagination = function(req, res, next) {
	CarService.getAllPricePagination(req.params.id, req.params.currentPage, req.params.pageSize, function(err, results) {
		if (err) {
			return next(err);
		}
		res.jsonp(results);
	});
};

exports.getSize = function(req, res, next) {
	Car.count(function(err, result) {
		if (err) {
			return next(err);
		}
		res.jsonp(result);
	});
};