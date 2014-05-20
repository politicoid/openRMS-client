agoraApp.controller('ItemDetailCtrl', function($scope, $http, $routeParams){
	$http.get("/item.php?format=json", {params: {iid: $routeParams.iid, sid: $routeParams.sid} })
	.success(function (results) {
		$scope.item = results.data;
	});
});

agoraApp.controller('ItemListCtrl', function($scope, $http, $routeParams){
	if ($scope.categories == null)
	{
		$http.get("/item.php?format=json", {params: {sid: $routeParams.sid} })
		.success(function (results) {
			$scope.items = results.data;
			$http.get("/item_category.php?format=json", {params: {sid: $routeParams.sid} }).success(function (results) {
				$scope.categories = ItemCategory.convertFormat(results.data, $routeParams.cid);
				if ($routeParams.cid != null)
					$scope.category = 'cat-' + $routeParams.cid;
				else
					$scope.category = 'cat-0';
				if ($routeParams.ms != null)
					$scope.min_score = $routeParams.ms;
				else
					$scope.min_score = 3.5;
			});
		});
	}
}).directive('categories', function($routeParams) { // Quickly thrown together without knowing what I'm doing. Works, but probably not right
	var linkFunction = function ($scope, $element, $attrs)
	{
		$scope.$watch('categories', function() {
			if ($scope.categories != null)
			{
				var params = {"types" : {
			    	"default" : {
			        	"icon" : "glyphicon glyphicon-tower"
			      	},
			      	"demo" : {
			        	"icon" : "glyphicon glyphicon-ok"
			      		}
			   		},
			    	"plugins" : [ "types" ],
					'core' : {
			    		'data' : $scope.categories
			    	}
				};
				jsChange = function (event, data) {
					$scope.category = data.selected[0];
					var loc = "#" + '/shop/' + $routeParams.sid + '/items/' + $scope.category.substring(4) + '/' + $scope.min_score;
					document.location.hash = loc;
				};
				$scope.itemFilter = function(item)
				{
					
					return item.score >= $scope.min_score;
				};
			}
		});
	};
	return {
		restrict: 'A',
		compile: function ($element, $attrs)
		{
			return linkFunction;
		}
	};
}).directive('scores', function($routeParams) {
	var linkFunction = function ($scope, $element, $attrs)
	{
		$scope.$watch('min_score', function () {
			var onClick = function(score, evt)
			{
				$scope.min_score = score;
				var loc = "#" + '/shop/' + $routeParams.sid + '/items/' + $scope.category.substring(4) + '/' + $scope.min_score;
				document.location.hash = loc;
			};
			$element.raty({
				number: 5,
				half: true,
				score: $scope.min_score,
				click: onClick
			});
		});
	};
	return {
		restrict: 'A',
		compile: function ($element, $attrs)
		{
			return linkFunction;
		}
	};
});

agoraApp.controller('ItemReviewListCtrl', function ($scope, $http, $routeParams) {
	$http.get("/item_review.php?format=json", {params: {iid: $routeParams.iid} }).success(function (results) {
		$scope.reviews = results.data;
		$scope.editor_hidden = true;
	});
}).directive('editor', function($routeParams) {
	var linkFunction = function ($scope, $element, $attrs)
	{
		tinymce.init({
		selector: "#review_editor",
		plugins: [
			"save advlist autolink lists link image charmap print preview anchor",
			"searchreplace visualblocks code fullscreen",
			"insertdatetime media table contextmenu paste"
		],
		toolbar: "save | insertfile undo redo | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image",
		autosave_ask_before_unload: false});
		
		$('#review_rating').raty({
			number: 5,
			half: true,
			score: 3.5,
		});
	};
	return {
		restrict: 'E',
		templateUrl: 'views/item/review_editor.html',
		compile: function ($element, $attrs)
		{
			return linkFunction;
		}
	};
});