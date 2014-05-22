agoraApp.controller('ShopListCtrl', function($scope, connectionFactory) {
	connectionFactory.getShops().then(function(shops) {
		$scope.shops = shops;
	});
});
agoraApp.controller('ShopDetailCtrl', function($scope, connectionFactory, $routeParams){
	connectionFactory.getItems($routeParams.sid).then(function(items) {
		$scope.items = items;
	});
});