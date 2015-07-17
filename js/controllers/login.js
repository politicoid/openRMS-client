openRMSApp.controller('LoginCtrl', function ($scope) {
}).directive('login', function ($compile, connectionFactory, $location, storageService) {
	var linkFunction = function($scope, $element)
	{
		$scope.login = function(username, password)
		{
			connectionFactory.login(username, password).then(function (session) {
				$scope.$parent.session = session;
				$location.path('/');
			});
		};
	};
	return {
		restrict: 'E',
		templateUrl: 'views/login.html',
		compile: function ($element, $attrs, $timeout)
		{
			return linkFunction;
		}
	};		
});
