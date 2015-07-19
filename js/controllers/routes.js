openRMSApp.config(function($routeProvider) {
	$routeProvider.when('/:url?', {
		templateUrl: '/views/resource.html',
		controller: 'MainCtrl',
		resolve: { myVar:
			function (connectionFactory) {
				return connectionFactory.connected;
			}
		}
	}).otherwise({
		redirectTo: '/'
	});
});
