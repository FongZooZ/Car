angular.module('car', [])
	.service('PortService', function($http, $rootScope) {
		this.getAllPort = function(id) {
			return $http.get('/api/port');
		};
		this.getPortByCountry = function(id) {
			return $http.get('/api/port/' + id);
		};
	})
	.controller('CarController', function($scope, PortService) {
		$scope.thList = [
			'#', 'Ref No', 'Make', 'Model', 'FOB Price', 'Final Price'
		];
		$scope.cars = cars;
		$scope.carsWithPrice;
		$scope.countries = countries;
		$scope.ports;
		$scope.finalPrice = false;

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
				return;
			}
			// TODO: call to server, server calculate price then send back to client
		};
	});