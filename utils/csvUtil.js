var
	csv = require('fast-csv'),
	_ = require('underscore'),
	async = require('async'),
	mongoose = require('mongoose');

var
	CarService = require('../services/carService'),
	CountryService = require('../services/countryService'),
	MakeService = require('../services/makeService'),
	ModelService = require('../services/modelService'),
	PortService = require('../services/portService'),
	Car = require('../services/models/Car'),
	Make = require('../services/models/Make'),
	Model = require('../services/models/Model');

var
	stocksPath = './data/stocks.csv',
	freightsPath = './data/freights.csv',
	makes = [],
	models = [],
	cars = [],
	countries = [],
	ports = [];

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
				data.FOBPrice = parseInt(data.FOBPrice) || 0;
				data.VehicleWidth = parseInt(data.VehicleWidth);
				data.VehicleLength = parseInt(data.VehicleLength);
				data.VehicleHeight = parseInt(data.VehicleHeight);
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
				callback(null, [makes, models]);
			});
		},
		function(callback) {
			csv.fromPath(freightsPath, {
				headers: true,
				objectMode: true
			}).on("data", function(data) {
				data.USDperm3 = parseInt(data.USDperm3) || 0;
				countries.push({
					name: data.Country
				});
				ports.push({
					name: data.Port,
					country: data.Country,
					costPerVolume: data.USDperm3
				});
			}).on("end", function() {
				countries = _.uniq(countries, function(country) {
					return country.name;
				});
				callback(null, countries);
			});
		}
	], function(err, results) {
		if (err) {

		}
		callback();
	});
}

/**
 * Load Stocks (car, model, make) into database
 * @return {void}
 */
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
									callback3(null, cars);
								}
							});
						}
					], function(err, results) {
						if (err) {
							callback2(err);
						} else {
							callback2();
						}
					});
				},
				// add car to database
				function(callback2) {
					CarService.createCar(cars, function(err, cars) {
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

/**
 * Load Freights (country, port) into database
 * @return {void}
 */
var loadFreights = function loadFreights() {
	async.series([
		// add countries
		function(callback1) {
			async.eachLimit(countries, 20, function(country, callback2) {
				CountryService.createCountry(country, function(err, country) {
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
			})
		},

		// add ports
		function(callback1) {
			async.series([
				function(callback2) {
					async.each(ports, function(port, callback3) {
						CountryService.getCountryByName(port.country, function(err, country) {
							if (err) {
								callback3(err)
							} else {
								ports[ports.indexOf(port)].country = country._id;
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
				function(callback3) {
					PortService.createPort(ports, function(err, ports) {
						if (err) {
							callback3(err);
						} else {
							callback3();
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
			console.log("done");
		}
	});
}

/**
 * Drop database 'Car'
 * @return {[type]} [description]
 */
var dropCarDB = function dropCarDB() {
	mongoose.connection.db.dropDatabase();
}

load(function() {
	async.series([
		function(callback1) {
			dropCarDB();
			callback1();
		},
		function(callback1) {
			async.parallel([
				function(callback2) {
					loadStocks();
					callback2();
				},
				function(callback2) {
					loadFreights();
					callback2();
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
});