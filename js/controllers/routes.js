agoraApp.config(function($routeProvider) {
	$routeProvider.when('/shops', {
		templateUrl: 'views/shop/list.html',
		controller: 'ShopListCtrl',
		resolve: { myVar:
			function (connectionFactory) {
				return connectionFactory.connected;
			}
		}
	}).when('/shop/:sid', {
		templateUrl: 'views/shop/detailed.html',
		controller: 'ShopDetailCtrl',
		resolve: { myVar:
			function (connectionFactory) {
				return connectionFactory.connected;
			}
		}
	}).when('/shop/:sid/items/', {
		templateUrl: 'views/item/list.html',
		controller: 'ItemListCtrl',
		resolve: { myVar:
			function (connectionFactory) {
				return connectionFactory.connected;
			}
		}
	}).when('/admin', {
		templateUrl: 'admin/views/admin.html',
		controller: 'AdminCtrl',
		resolve: { myVar:
			function (connectionFactory) {
				return connectionFactory.connected;
			}
		}
/*
	}).when('/shop/:sid/items/:cid/', {
		templateUrl: 'views/item/list.html',
		controller: 'ItemListCtrl'
	}).when('/shop/:sid/items/:cid/:ms', {
		templateUrl: 'views/item/list.html',
		controller: 'ItemListCtrl'
	}).when('/shop/:sid/item/:iid', {
		templateUrl: 'views/item/detailed.html',
		controller: 'ItemDetailCtrl'
	}).when('/user/', {
		templateUrl: 'views/user/detailed.html',
		controller: 'UserDetailCtrl'
	}).when('/cart', {
		templateUrl: 'views/cart/detailed.html',
		controller: 'CartDetailCtrl'
*/
	}).otherwise({
		redirectTo: '/shops'
	});
});