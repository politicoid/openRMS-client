agoraApp.controller('ShopListCtrl', function($scope, connectionFactory) {
	connectionFactory.getDocs("shop").then(function(shops) {
		$scope.shops = shops;
	});
});
agoraApp.controller('ShopDetailCtrl', function($scope, connectionFactory, $routeParams){
	connectionFactory.getDocs("item", {shop: $routeParams.sid}).then(function(items) {
		$scope.items = items;
	});
});