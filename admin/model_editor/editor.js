var addElement = function()
{
	
};

openRMSApp.directive('editorElement', function ($compile) {
	var linkFunction = function($scope, $element)
	{
	};
	return {
		restrict: 'E',
		scope: true,
		templateUrl: 'admin/views/model_editor/element.html',
		compile: function ($scope, $element, $attrs, $timeout)
		{
			return linkFunction;
		}
	};
);
