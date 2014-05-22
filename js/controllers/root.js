var agoraApp = angular.module('agoraApp', ['ngRoute', 'ngSanitize']);

agoraApp.controller('MainCtrl', function($scope, $routeParams, connectionFactory) {
	$scope.session = 0;
	$.fn.raty.defaults.path = '/images';
	// !$scope.loaded prevents the listener from being added multiple times!
	if (!$scope.loaded)
	{
		$scope.$on('$viewContentLoaded', function () {
			if ($scope.shop == null || $scope.shop._id != $routeParams.sid)
			{
				var sid = 0;
				if ($routeParams.sid != null)
				{
					sid = $routeParams.sid;
				}
				connectionFactory.getDoc("shop", sid).then(function (shop) {
					$scope.shop = shop;
				});
			}
		});
		$scope.loaded = true;
	}
});