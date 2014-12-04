agoraApp.config(function($routeProvider) {
	$routeProvider.when('/list/:resource/:sid?', {
		template: "<document-table></document-table>",
		resolve: { myVar:
			function (connectionFactory) {
				return connectionFactory.connected;
			}
		}
	}).when('/edit/:resource/:id?', {
		template: "<document-editor></document-editor>",
		controller: 'ModelEditCtrl',
		resolve: { myVar:
			function (connectionFactory) {
				return connectionFactory.connected;
			}
		}
	}).when('/login', {
		template: "<login></login>",
		controller: 'LoginCtrl',
		resolve: { myVar:
			function (connectionFactory) {
				return connectionFactory.connected;
			}
		}
	}).otherwise({
		redirectTo: "/list/user"
	});
});