openRMSApp.config(function($routeProvider) {
	$routeProvider.when('/:url?', {
		templateUrl: 'resource.html',
		controller: 'resourceCtrl',
		resolve: { myVar:
			function (connectionFactory) {
				return connectionFactory.connected;
			}
		}
	}).otherwise({
		redirectTo: '/'
	});
});
