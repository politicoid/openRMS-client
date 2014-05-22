agoraApp.config(function($routeProvider) {
	$routeProvider.when('/shop', {
		template: "<document-table></document-table>",
		controller: 'ShopListCtrl',
		resolve: { myVar:
			function (connectionFactory) {
				return connectionFactory.connected;
			}
		}
	}).when('/item', {
		template: "<document-table></document-table>",
		controller: 'ItemListCtrl',
		resolve: { myVar:
			function (connectionFactory) {
				return connectionFactory.connected;
			}
		}
	}).when('/:model', {
		template: "<document-table></document-table>",
		controller: 'ModelListCtrl',
		resolve: { myVar:
			function (connectionFactory) {
				return connectionFactory.connected;
			}
		}
	}).otherwise({
		redirectTo: "/shop"
	});
});