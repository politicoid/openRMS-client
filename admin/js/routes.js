agoraApp.config(function($routeProvider) {
	$routeProvider.when('/list/shop', {
		template: "<document-table></document-table>",
		controller: 'ShopListCtrl',
		resolve: { myVar:
			function (connectionFactory) {
				return connectionFactory.connected;
			}
		}
	}).when('/list/item/:sid?', {
		template: "<document-table></document-table>",
		controller: 'ItemListCtrl',
		resolve: { myVar:
			function (connectionFactory) {
				return connectionFactory.connected;
			}
		}
	}).when('/list/:resource/:sid?', {
		template: "<document-table></document-table>",
		controller: 'ModelListCtrl',
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
	}).otherwise({
		redirectTo: "/list/shop"
	});
});