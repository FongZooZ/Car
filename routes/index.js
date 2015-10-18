var
	express = require('express'),
	router = express.Router();

var
	Home = require('../api/Home'),
	Port = require('../api/Port'),
	Car = require('../api/Car');

/* GET home page. */
router.get('/', Home.index);

// Port
router.get('/api/port', Port.getAllPort);
router.get('/api/port/:id', Port.getPortByCountry);

// Car
router.get('/api/car/priceForPort/:id', Car.calculateFinalPrice);
router.get('/api/car/getCarPagination/:currentPage/:pageSize', Car.getCarPagination);
router.get('/api/car/getAllPricePagination/:id/:currentPage/:pageSize', Car.getAllPricePagination);
router.get('/api/car/size', Car.getSize);

module.exports = router;