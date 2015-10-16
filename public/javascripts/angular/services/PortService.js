angular.module('car', [])
	.service('PortService', function($http, $rootScope) {
		this.getAllPort = function() {
			return $http.get('/api/port');
		};
	});