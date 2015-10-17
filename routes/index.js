var
	express = require('express'),
	router = express.Router();

var
	Home = require('../api/Home'),
	Port = require('../api/Port');

/* GET home page. */
router.get('/', Home.index);

// Port
router.get('/api/port', Port.getAllPort);
router.get('/api/port/:id', Port.getPortByCountry);
router.get('/api/port/priceForPort/:id', Port.calculateFinalPrice)

// Pricing

module.exports = router;