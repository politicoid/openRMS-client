agoraApp.controller('ShopListCtrl', function($scope, $http){
	$http.get("/shop.php?format=json").success(function (results) {
		$scope.shops = results.data;
	});		    	
});

agoraApp.controller('ShopDetailCtrl', function($scope, $http, $routeParams){
	$http.get("/item.php?format=json", {params: {sid: $routeParams.sid} })
	.success(function (results) {
		$scope.items = results.data;
	});
});