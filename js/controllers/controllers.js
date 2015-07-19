
var openRMSApp = angular.module('openRMSApp', ['ngRoute', 'ngSanitize']);


openRMSApp.controller('MainCtrl', function ($scope, connectionFactory, $routeParams) {
	var url = $routeParams.url;
	if (url == null) url = "/";

	if (!$scope.loaded)
	{
		$scope.url = url;
		$scope.$on('$viewContentLoaded', function () {
			$scope.loaded = true;
		});
	}
// Grabs a resource from a specified URL and renders it
}).directive("resource", function(connectionFactory) {
	var linkFunction = function(scope, element, attr) {
		scope.$watch(scope.loaded, function() {
		// Grab document
		var url = attr.url;
		if (url !== null)
		{
			connectionFactory.getByURL(url, false).then(function(data) {
				// Check for rendering "engine"	
				var sublist = data.mime_type.split("/");

				// If found, use it, oherwise use table rendering
				if (sublist != null && sublist[0] == "text")
				{
					var el = $(element);
					// For some reason jqlite is still default, even though jquery script was loaded first
					var content = el.find(".content");
					content.append(angular.element("<b>" + data.doc.content + "</b>"));
				} else
				{
		
				}
			});
		}
		});
	};
	return {
		restrict: 'E',
		transclude: true,
		templateUrl: 'views/resource.html',
		compile: function(scope, element, attrs, timeout) { return linkFunction; }
	};
});
