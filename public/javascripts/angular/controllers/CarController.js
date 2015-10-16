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
		$scope.countries = countries;
		$scope.ports;

		$scope.getPortByCountry = function(id) {
			if (!id) {
				return;
			}
			console.log(id);
			PortService.getPortByCountry(id).then(function(results) {
				$scope.ports = results.data;
			});
		};
	});