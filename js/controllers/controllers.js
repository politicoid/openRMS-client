
var openRMSApp = angular.module('openRMSApp', ['ngRoute', 'ngSanitize']);


openRMSApp.controller('MainCtrl', function ($scope, connectionFactory, $routeParams) {
	var url = $routeParams.url;
	if (url == null) url = "/";
	$scope.url = url;

	if (!$scope.loaded)
	{
		$scope.url = url;
		$scope.$on('$viewContentLoaded', function () {
			$scope.loaded = true;
		});
	}
// Grabs a resource from a specified URL and renders it
}).directive("resource", function(connectionFactory) {
	var link = function(scope, element, attributes) {
		// Grab document
		var url = attributes.url;
		if (url !== null)
		{
			connectionFactory.getByURL(url, false).then(function(data) {
				// Check for rendering "engine"	
				var sublist = data.mime_type.split("/");

				// If found, use it, oherwise use table rendering
				if (sublist != null && sublist[0] == "text")
				{
					// For some reason jqlite is still default, even though jquery script was loaded first
					element.append(angular.element("<h1>" + url + "</h1><hr/><div>" + data.doc.content + "</div>"));
				} else
				{
		
				}
			});
		}
//		element.append(angular.element("Testing"));
		return function(element, attrs) {};
	};
	return {
		restrict: 'E',
		transclude: true,
		template: '<div></div>',
		link: link
	};
});
