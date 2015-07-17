// Helper function: http://stackoverflow.com/questions/6491463/accessing-nested-javascript-objects-with-string-key
var byString = function(o, s) {
    s = s.replace(/\[(\w+)\]/g, '.$1'); // convert indexes to properties
    s = s.replace(/^\./, '');           // strip a leading dot
    var a = s.split('.');
    while (a.length) {
        var n = a.shift();
        if (n in o) {
            o = o[n];
        } else {
            return;
        }
    }
    return o;
};

var extract = function(o, string)
{
	if (string != null)
	{
		// Not sure how to get the directive to compile with data so use this instead..
		if (string.substring(0, 2) == "{{" && (string.indexOf("}}") == string.length - 2))
		{
			var temp = string.substring(2, string.length - 2);
			return byString(o, temp);
		}
		return string;
	}
	return null;
};

// Change this so it doesn't use {{}} - No sure what I meant by this now...
var getAttributes = function($scope, $element)
{
	var field = $element.attr('field');
	if (field != null)
		$scope.field = extract($scope, field);
	var path = $element.attr('path');
	if (path != null)
	{
		path = extract($scope, path);
		if (path != null)
		{
			$scope.path = path;
			var meta = path.options;
			if (meta.type != null && meta.type[0])
			{
				meta = meta.type[0];
				$scope.isArray = true;
			}
			$scope.meta = meta;
		}
	} else
	{
		// Error
	}
};

var openrmsApp = angular.module('openRMSApp', ['ngRoute', 'ngSanitize']);
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

agoraApp.controller('MainCtrl', function($scope, $routeParams, connectionFactory, storageService, $location) {
	$scope.session = 0;
	$scope.goLogin = function()
	{
		$location.path("/login");
	};
	$scope.$on('$viewContentLoaded', function () {
		if ($scope.models) return;
		connectionFactory.getModels().then(function (models) {
			$scope.models = models;
		});
	});
// Converting Model List Controller & document-table to general use
}).controller('ModelListCtrl', function ($scope, connectionFactory, $routeParams) {
	var resource = $routeParams.resource;
	var sid = $routeParams.sid;
	if (sid == null)
		sid = 0;

	$scope.filter = {};

	var getData = function(resource) {
		var model = $scope.models[resource];
		$scope.model = model;
		connectionFactory.getDocs(resource, $scope.filter).then(function (docs) {
			$scope.docs = docs;
		});
	};

	$scope.$watch('resource', function($value)
	{
		var val = $value || null;
		if (val)
		{
			if (!$scope.models)
			{
				$scope.$watch('models', function($value) {
					var val = $value || null;
					if (val)
					{
						getData($scope.resource);
					}
				});
			} else
			{
				getData($scope.resource);
			}
		}
	});
	if (resource != null)
		$scope.resource = resource;
}).directive('documentTable', function($compile, $location)
{
	var linkFunction = function($scope, $element)
	{
		var resource = $element.attr('dtResource');
		var embedded = $element.attr('dtEmbedded');
		if (embedded != null)
			$scope.embedded = embedded;
		if (resource != null)
			$scope.resource = extract($scope, resource);
		$scope.linked = true;
		$scope.$watch('docs', function() {
			$scope.edit_entry = function(doc)
			{
				var path = "/edit/" + $scope.resource;
				if (doc != null)
				{
					path = path + "/" + doc._id;
				}
				$location.path(path);
			};
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
		templateUrl: 'admin/views/document_table.html',
		controller: 'ModelListCtrl',
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
		$scope.delete_entry = function(doc)
		{
			if (doc != null)
			{
				if (window.confirm("Are you sure you want to delete #" + doc._id + "?"))
				{
					connectionFactory.deleteDoc(resource, doc._id);
				}
			}
		};
		if ($scope.$last)
		{
			$scope.lastEntry = true;
		}
	};
// I can probably do away with this directive since it was mainly in place to ensure that dataTables was called after documentEntry was done rendering.
// However, I can do this easily now that I know how to use $timeout
}).directive('documentField', function ($compile) {
	return function($scope, $element, $attrs) {
		if ($scope.$last && $scope.lastEntry) {
			$scope.$watch('linked', function($value) {
				var val = $value || null;
				if (val)
				{
					$element.parents().find('table').first().dataTable({
						"bFilter": false
					});
				}
			});
		}
	};
}).controller('ModelEditCtrl', function ($scope, connectionFactory, $routeParams, $location) {
	var resource = $routeParams.resource;
	$scope.$parent.resource = resource;
	$scope.save = function() {
		console.log($scope.doc);
		connectionFactory.saveDoc(resource, $scope.doc).then(function (doc) {
			$location.path('/list/' + resource + '');
		});
	};
	var id = $routeParams.id;
	$scope.$watch('models', function($value) {
		var val = $value || null;
		if (val)
		{
			var model = $scope.models[resource];
			$scope.model = model;
			if (id)
			{
				connectionFactory.getDoc(resource, id).then(function (doc) {
					$scope.doc = doc;
				});
			} else
			{
				$scope.doc = {};
			}
			$scope.filter = $scope.doc;
		}
	});
}).directive("documentFilter", function ($compile, connectionFactory) {
	var linkFunction = function($scope, $element)
	{
		getAttributes($scope, $element);
		var filter = $element.attr('filter');
		var constraints = $element.attr('constraints');
		if (filter != null && constraints != null)
		{
			$scope.constraints = extract(constraints);
			$scope.filter = extract($scope, filter);
			if ($scope.path != null)
			{
				var path = $scope.path;
				var resource = $scope.meta.parent;
				if (resource != null)
				{
					$scope.resource = resource;
					var model = $scope.models[resource];
					$scope.model = model;
					$scope.readable_key = model.keys['human_readable'];
					connectionFactory.getDocs(resource, constraints, { path: resource, select: model.keys['readable_key'] + ' _id' }).then(function (docs) {
						$scope.options = docs;
					});
				}
			}
		}
	};
	return {
		restrict: 'E',
		scope: true,
		templateUrl: 'admin/views/document_filter.html',
		compile: function ($scope, $element, $attrs, $timeout)
		{
			return linkFunction;
		}
	};	
}).directive('documentEditor', function ($compile) {
	var linkFunction = function($scope, $element)
	{
	};
	return {
		restrict: 'E',
		scope: true,
		templateUrl: 'admin/views/document_editor.html',
		compile: function ($scope, $element, $attrs, $timeout)
		{
			return linkFunction;
		}
	};
}).directive('documentInput', function ($compile, $timeout, connectionFactory) {
	var linkFunction = function($scope, $element)
	{
		getAttributes($scope, $element);
		var meta = $scope.meta;
		var constraints = $element.attr('constraints');
		if (constraints == null)
			constraints = {};
		else
			constraints = extract($scope, constraints);
			
		$scope.constraints = constraints;
		var id = "doc-input-" + $scope.field;
		if (meta.ref && !meta.parent && !$scope.isArray)
		{
			if ($scope.path != null)
			{
				var path = $scope.path;
				var resource = meta.ref;
				if (resource != null)
				{
					$scope.resource = resource;
					var model = $scope.models[resource];
					$scope.model = model;
					$scope.readable_key = model.keys['human_readable'];
					connectionFactory.getDocs(resource, constraints, { path: resource, select: model.keys['readable_key'] + ' _id' }).then(function (docs) {
						$scope.options = docs;
					});
				}
			}
		}
		$timeout(function () {
			var textbox = $.find("#" + id)[0];
			if (textbox != null)
			{
				tinymce.init({
				setup: function (ed) {
					ed.on('init', function (e) {
						if ($scope.doc[$scope.field] == null)
							$scope.doc[$scope.field] = "";
						ed.setContent($scope.doc[$scope.field]);
					});
				},
				selector: "#" + id,
				plugins: [
					"save advlist autolink lists link image charmap print preview anchor",
					"searchreplace visualblocks code fullscreen",
					"insertdatetime media table contextmenu paste"
				],
				toolbar: "save | insertfile undo redo | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image",
				autosave_ask_before_unload: false});
			}
		});
	};
	return {
		restrict: 'E',
		scope: true,
		templateUrl: 'admin/views/document_input.html',
		compile: function ($scope, $element, $attrs, $timeout)
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
// http://shahjadatalukdar.wordpress.com/2013/09/27/using-html5-localstorage-with-angularjs/
});
