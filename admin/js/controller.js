var agoraApp = angular.module('agoraApp', ['ngRoute', 'ngSanitize']);

agoraApp.controller('MainCtrl', function($scope, $routeParams, connectionFactory) {
	$scope.$on('$viewContentLoaded', function () {
		connectionFactory.getModels().then(function (models) {
			$scope.models = models;
			var model_keys = [];
			for (var key in models)
			{
				model_keys.push(key);
			}
			$scope.model_keys = model_keys;
		});
	});
}).controller('ShopListCtrl', function ($scope, connectionFactory, $routeParams) {
	$scope.columns = ['name', 'stylized', 'url', 'short_desc'];
	$scope.$parent.resource = "shop";
	var sid = $routeParams.sid;
	if (sid == null)
		sid = 0;
	connectionFactory.getDocs("shop", sid).then(function (docs) {
		$scope.docs = docs;
	});
}).controller('ItemListCtrl', function ($scope, connectionFactory, $routeParams) {
	$scope.columns = ['name', 'sku', 'short_desc'];
	$scope.$parent.resource = "shop";
	var sid = $routeParams.sid;
	if (sid == null)
		sid = 0;
	connectionFactory.getDocs("item", sid).then(function (docs) {
		$scope.docs = docs;
	});
}).directive('documentTable', function($compile)
{
	var linkFunction = function($scope, $element)
	{
		$scope.$watch('docs', function() {
			if ($scope.docs && $scope.docs.length == 0)
			{
				$element.find("table").dataTable({
					"bFilter": false
				});
			}
		});
	};
	return {
		restrict: 'E',
		scope: true,
		templateUrl: 'admin/views/document_table.html',
		compile: function ($element, $attrs, $timeout)
		{
			return linkFunction;
		}
	};	
// These last two directives mainly exist to help ensure that dataTables isn't called until after the table is constructed.
// There might be an easier way to do this, but this works fine for now.
}).directive('documentEntry', function ($compile) {
	return function($scope) {
		if ($scope.$last)
		{
			$scope.lastEntry = true;
		}
	};
}).directive('documentField', function ($compile) {
	return function($scope, $element, $attrs) {
		if ($scope.$last && $scope.lastEntry) {
			$element.parents().find('table').first().dataTable({
				"bFilter": false
			});
		}
	};
}).filter('normalize', function() {
    return function($input, $scope) {
    	var split = $input.split('_');
    	var string = "";
    	for (i = 0; i < split.length; i++)
    	{
    		var term = split[i];
    		if (i != 0) string = string + " ";
			string = string + term.substring(0, 1).toUpperCase() + term.substring(1);
	   	}
	   	return string;
    };
});