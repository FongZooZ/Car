var csv = require('fast-csv'),
	_ = require('underscore'),
	async = require('async');

var CarService = require('../services/carService'),
	CountryService = require('../services/countryService'),
	MakeService = require('../services/makeService'),
	ModelService = require('../services/modelService'),
	PortService = require('../services/portService'),
	Car = require('../services/models/Car'),
	Make = require('../services/models/Make'),
	Model = require('../services/models/Model');

var stocks = [],
	freights = [],
	stocksPath = './data/stocks.csv',
	freightsPath = './data/freights.csv',
	makes = [],
	models = [],
	cars = [],
	countries = [];

/**
 * Load data from csv
 * @param  {Function} callback Callback function
 * @return {void}
 */
var load = function load(callback) {
	async.parallel([
		function(callback) {
			csv.fromPath(stocksPath, {
				headers: true,
				objectMode: true
			}).on("data", function(data) {
				data.FOBPrice = parseInt(data.FOBPrice);
				data.VehicleWidth = parseInt(data.VehicleWidth);
				data.VehicleLength = parseInt(data.VehicleLength);
				data.VehicleHeight = parseInt(data.VehicleHeight);
				stocks.push(data);
				makes.push({
					name: data.Make
				});
				models.push({
					name: data.Model,
					make: data.Make
				});
				cars.push({
					referenceNo: data.ReferenceNo,
					make: data.Make,
					model: data.Model,
					fob: data.FOBPrice,
					specs: {
						width: data.VehicleWidth,
						length: data.VehicleLength,
						height: data.VehicleHeight
					}
				});
			}).on("end", function() {
				makes = _.uniq(makes, function(make) {
					return make.name;
				});
				models = _.uniq(models, function(model) {
					return model.name;
				});
				callback(null, [stocks, makes, models]);
			});
		},
		function(callback) {
			csv.fromPath(freightsPath, {
				headers: true,
				objectMode: true
			}).on("data", function(data) {
				data.USDperm3 = parseInt(data.USDperm3);
				freights.push(data);
				countries.push(data.Country);
			}).on("end", function() {
				countries = _.uniq(countries);
				callback(null, countries);
			});
		}
	], function(err, results) {
		callback();
	});
}

var loadStocks = function loadStocks() {
	async.series([
		// add makes
		function(callback1) {
			async.each(makes, function(make, callback2) {
				MakeService.createMake(make, function(err, make) {
					if (err) {
						callback2(err);
					} else {
						callback2();
					}
				});
			}, function(err) {
				if (err) {
					callback1(err);
				} else {
					callback1();
				}
			});
		},

		// add models
		function(callback1) {
			var modelsData = [];
			async.series([
				function(callback2) {
					async.each(models, function(model, callback3) {
						MakeService.getMakeByName(model.make, function(err, make) {
							if (err) {
								callback3(err);
							} else {
								modelsData.push({
									name: model.name,
									make: make._id
								});
								callback3();
							}
						});
					}, function(err) {
						if (err) {
							callback2(err);
						} else {
							callback2();
						}
					});
				},
				function(callback2) {
					ModelService.createModel(modelsData, function(err, models) {
						if (err) {
							callback2(err);
						} else {
							callback2();
						}
					});
				}
			], function(err) {
				if (err) {
					callback1(err);
				} else {
					callback1();
				}
			});
		},

		// add cars
		function(callback1) {

			async.series([
				// get id
				function(callback2) {
					async.parallel([
						// get make id
						function(callback3) {
							async.each(cars, function(car, callback4) {
								MakeService.getMakeByName(car.make, function(err, make) {
									if (err) {
										callback4(err);
									} else {
										cars[cars.indexOf(car)].make = make._id;
										callback4();
									}
								});
							}, function(err) {
								if (err) {
									callback3(err);
								} else {
									console.log(1)
									callback3(null, cars);
								}
							});
						},
						// get model id
						function(callback3) {
							async.each(cars, function(car, callback4) {
								ModelService.getModelByName(car.model, function(err, model) {
									if (err) {
										callback4(err);
									} else {
										cars[cars.indexOf(car)].model = model._id;
										callback4();
									}
								});
							}, function(err) {
								if (err) {
									callback3(err);
								} else {
									console.log(2)
									callback3(null, cars);
								}
							});
						}
					], function(err, results) {
						if (err) {
							callback2(err);
						} else {
							console.log(3)
							callback2();
						}
					});
				},
				// add car to database
				function(callback2) {
					async.each(cars, function(car, callback3) {
						CarService.createCar(car, function(err, car) {
							if (err) {
								callback3(err);
							} else {
								callback3();
							}
						});
					}, function(err) {
						if (err) {
							callback2(err);
						} else {
							callback2();
						}
					});
				}
			], function(err) {
				if (err) {
					callback1(err);
				} else {
					callback1();
				}
			});
		}
	], function(err) {
		if (err) {
			console.log(err);
		} else {
			console.log('done');
		}
	});
}

var loadFreights = function loadFreights() {

}

load(function() {
	// loadStocks();
	loadFreights();
});