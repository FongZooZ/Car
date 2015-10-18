angular.module('car', ['ui.bootstrap'])
	.service('PortService', function($http, $rootScope) {
		this.getAllPort = function(id) {
			return $http.get('/api/port');
		};
		this.getPortByCountry = function(id) {
			return $http.get('/api/port/' + id);
		};
		this.getFinalPrice = function(id) {
			return $http.get('/api/port/priceForPort/' + id);
		};
	})
	.controller('CarController', function($scope, PortService) {
		$scope.thList = [
			'#', 'Ref No', 'Make', 'Model', 'FOB Price', 'Final Price'
		];
		$scope.cars = cars;
		$scope.countries = countries;
		$scope.ports;
		$scope.finalPrice = false;
		$scope.carsToDisplay = cars;

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
		 * Calculate final price for car then display
		 * @param  {ObjectId} id Id of port. To check that port is selected or not
		 * @return {void}
		 */
		$scope.displayFinalPrice = function(id) {
			if (!id) {
				$scope.finalPrice = false;
				$scope.carsToDisplay = cars;
				return;
			}
			PortService.getFinalPrice(id).then(function(results) {
				$scope.finalPrice = true;
				$scope.carsToDisplay = results.data;
			});
		};
	});