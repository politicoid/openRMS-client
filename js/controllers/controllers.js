openRMSApp.controller('ResourceCtrl', function ($scope, connectionFactory, $routeParams) {
	var linkFunction = function($scope, $element) {
		var url = $routeParams.url;
		if (url == null)
			url = "/";
		connectionFactory.getURL("index", url).then(function(doc) {
			$scope.doc = doc;
			$scope.links = doc.links;
			// Check for rendering "engine"
			var type = doc.mime_type;
			var sublist = type.split("/");
			// If found, use it, oherwise use table rendering
			if (type[0] == "text")
			{
				$element.append(doc.content);
			} else
			{
				
			}
		});
	};
	return {
		restrict: 'E',
		templateUrl: 'views/resource.html',
		compile: function ($element, $attrs, $timeout)
		{
			return linkFunction;
		}
	};
});
