angular.module('car', ['ui.bootstrap'])
	.service('PortService', function($http, $rootScope) {
		this.getAllPort = function(id) {
			return $http.get('/api/port');
		};
		this.getPortByCountry = function(id) {
			return $http.get('/api/port/' + id);
		};
	})
	.service('CarService', function($http, $rootScope) {
		this.getFinalPrice = function(id) {
			return $http.get('/api/car/priceForPort/' + id);
		};
		this.getCarPagination = function(currentPage, pageSize) {
			return $http.get('/api/car/getCarPagination/' + currentPage + '/' + pageSize);
		};
		this.getAllPricePagination = function(id, currentPage, pageSize) {
			return $http.get('/api/car/getAllPricePagination/' + id + '/' + currentPage + '/' + pageSize);
		};
		this.getSize = function() {
			return $http.get('/api/car/size');
		};
	})
	.controller('CarController', function($scope, PortService, CarService) {
		$scope.thList = [
			'#', 'Ref No', 'Make', 'Model', 'FOB Price', 'Final Price'
		];
		$scope.cars = [];
		$scope.countries = countries;
		$scope.ports;
		$scope.finalPrice = false;
		$scope.carsToDisplay = [];

		// for pagination
		$scope.currentPage = 1;
		$scope.pageSize = 10;
		$scope.totalCar;
		$scope.currentPort;

		/**
		 * Update size of car (number of car in Car collections)
		 * @return {void}
		 */
		$scope.updateCarSize = function() {
			CarService.getSize().then(function(results) {
				$scope.totalCar = results.data;
			});
		};

		/**
		 * Get all car with specific offset
		 * @param  {Number}   currentPage Current page in views
		 * @param  {Number}   pageSize    Maximum row per page in views
		 * @return {void}
		 */
		$scope.getCarPagination = function(currentPage, pageSize) {
			CarService.getCarPagination(currentPage, pageSize).then(function(results) {
				$scope.carsToDisplay = results.data;
			});
		};

		/**
		 * Get all car and its price for a port with specific offset
		 * @param  {ObjectId}   id          id a port
		 * @param  {Number}   currentPage 	Current page in views
		 * @param  {Number}   pageSize    	Maximum row per page in views
		 * @return {void}
		 */
		$scope.getAllPricePagination = function(id, currentPage, pageSize) {
			CarService.getAllPricePagination(id, currentPage, pageSize).then(function(results) {
				$scope.carsToDisplay = results.data;
			});
		};

		/**
		 * Initialize data
		 * @return {void}
		 */
		$scope.init = function() {
			$scope.updateCarSize();
			$scope.getCarPagination($scope.currentPage, $scope.pageSize);
		};

		/**
		 * Get port by country id
		 * @param  {ObjectId} id Id of country. Using for check and search
		 * @return {void}
		 */
		$scope.getPortByCountry = function(id) {
			if (!id) {
				return;
			}
			PortService.getPortByCountry(id).then(function(results) {
				$scope.ports = results.data;
			});
		};

		/**
		 * Update carsToDisplay when change page
		 * @return {void}
		 */
		$scope.changePage = function() {
			if (!$scope.finalPrice) {
				$scope.getCarPagination($scope.currentPage, $scope.pageSize);
			} else {
				$scope.getAllPricePagination($scope.currentPort, $scope.currentPage, $scope.pageSize);
			}
		};

		/**
		 * Calculate final price for car then display
		 * @param  {ObjectId} id Id of port. To check that port is selected or not
		 * @return {void}
		 */
		$scope.displayFinalPrice = function(id) {
			if (!id) {
				$scope.finalPrice = false;
				$scope.getCarPagination($scope.currentPage, $scope.pageSize);
				return;
			}
			CarService.getFinalPrice(id).then(function(results) {
				$scope.currentPort = id;
				$scope.finalPrice = true;
				$scope.getAllPricePagination(id, $scope.currentPage, $scope.pageSize);
			});
		};
	});