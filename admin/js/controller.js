var agoraApp = angular.module('agoraApp', ['ngRoute', 'ngSanitize']);

var normalize = function($input) {
	var split = $input.split('_');
	var string = "";
	for (var i = 0; i < split.length; i++)
	{
		var term = split[i];
		if (i != 0) string = string + " ";
			string = string + term.substring(0, 1).toUpperCase() + term.substring(1);
	}
   	return string;
};

agoraApp.controller('MainCtrl', function($scope, $routeParams, connectionFactory) {
	$scope.$on('$viewContentLoaded', function () {
		if (!$scope.loaded)
		{
			connectionFactory.getDocs("model").then(function (models) {
				$scope.models = models;
				var model_keys = [];
				for (var key in models)
				{
					model_keys.push(key);
				}
				$scope.model_keys = model_keys;
			});
		}
		$scope.loaded = true;
	});
}).controller('ShopListCtrl', function ($scope, connectionFactory, $routeParams) {
	$scope.columns = {'stylized': 'Name', 'url': "URL", 'short_desc': 'Short Description'};
	$scope.$parent.resource = "shop";
	var sid = $routeParams.sid;
	if (sid == null)
		sid = 0;
	connectionFactory.getDocs("shop").then(function (docs) {
		$scope.docs = docs;
	});
}).controller('ItemListCtrl', function ($scope, connectionFactory, $routeParams) {
	$scope.columns = {'name': 'Item', 'sku': 'SKU' , 'short_desc': 'Short Description'};
	$scope.$parent.resource = "item";
	var sid = $routeParams.sid;
	if (sid == null)
		sid = 0;
	connectionFactory.getDocs("item", {shop: sid}).then(function (docs) {
		$scope.docs = docs;
	});
}).controller('ModelListCtrl', function ($scope, connectionFactory, $routeParams) {
	var resource = $routeParams.resource;
	$scope.$parent.resource = resource;
	var sid = $routeParams.sid;
	if (sid == null)
		sid = 0;
	$scope.$watch('models', function($value) {
		var val = $value || null;
		if (val)
		{
			var model = $scope.models[resource];
			var columns = {};
			for (var key in model)
			{
				columns[key] = normalize(key);
			}
			$scope.columns = columns;
			connectionFactory.getDocs(resource, {shop: sid}).then(function (docs) {
				$scope.docs = docs;
			});
		}
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
	return function($scope, $element, connectionFactory) {
		var id = $element.attr('doc-id');
		var resource = $element.attr('resource');
		$element.attr('id', "doc-" + resource + "-" + id);
		$scope.delete_entry = function()
		{
			if (window.confirm("Are you sure you want to delete this entry?"))
			{
				connectionFactory.deleteDoc(resource, id);
			}
		};
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
}).controller('ModelEditCtrl', function ($scope, connectionFactory, $routeParams) {
	var resource = $routeParams.resource;
	$scope.$parent.resource = resource;
	var id = $routeParams.id;
	if (id)
	{
		$scope.$watch('models', function($value) {
			var val = $value || null;
			if (val)
			{
				var model = $scope.models[resource];
				var columns = {};
				for (var key in model)
				{
					columns[key] = normalize(key);
				}
				$scope.columns = columns;
				connectionFactory.getDocs(resource, {shop: sid}).then(function (docs) {
					$scope.docs = docs;
				});
			}
		});
	}
}).directive('documentEditor', function ($compile) {
	var linkFunction = function($scope, $element)
	{
	};
	return {
		restrict: 'E',
		scope: true,
		templateUrl: 'admin/views/document_editor.html',
		compile: function ($element, $attrs, $timeout)
		{
			return linkFunction;
		}
	};	
}).filter('normalize', function() {
    return normalize;
}).filter('trim', function() {
    return function($input) {
    	if ($input)
    	{
    		var string = $input + "";
    		if (string.length > 20)
    			string = string.substring(0, 20) + "...";
    		return string;
		} else
		{
			return $input;
		}
	};
});