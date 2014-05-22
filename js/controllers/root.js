var agoraApp = angular.module('agoraApp', ['ngRoute', 'ngSanitize']);

agoraApp.controller('MainCtrl', function($scope, $routeParams, connectionFactory) {
	$scope.session = 0;
	$.fn.raty.defaults.path = '/images';
	$scope.$on('$viewContentLoaded', function () {
		if ($scope.shop == null || $scope.shop._id != $routeParams.sid)
		{
			var sid = 0;
			if ($routeParams.sid != null)
			{
				sid = $routeParams.sid;
			}
			connectionFactory.getShop(sid).then(function (shop) {
				$scope.shop = shop;
			});
		}
	});
});