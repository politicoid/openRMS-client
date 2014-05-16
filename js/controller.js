var agoraApp = angular.module('agoraApp', ['ngRoute', 'ngSanitize']);

agoraApp.config(function($routeProvider) {
	$routeProvider.when('/shops', {
		templateUrl: 'partials/shop/list.html',
		controller: 'ShopListCtrl'
	}).when('/shop/:sid', {
		templateUrl: 'partials/shop/detailed.html',
		controller: 'ShopDetailCtrl'
	}).when('/shop/:sid/items/', {
		templateUrl: 'partials/item/list.html',
		controller: 'ItemListCtrl'
	}).when('/shop/:sid/items/:cid/', {
		templateUrl: 'partials/item/list.html',
		controller: 'ItemListCtrl'
	}).when('/shop/:sid/items/:cid/:ms', {
		templateUrl: 'partials/item/list.html',
		controller: 'ItemListCtrl'
	}).when('/shop/:sid/item/:iid', {
		templateUrl: 'partials/item/detailed.html',
		controller: 'ItemDetailCtrl'
	}).when('/user/', {
		templateUrl: 'partials/user/detailed.html',
		controller: 'UserDetailCtrl'
	}).when('/cart', {
		templateUrl: 'partials/cart/detailed.html',
		controller: 'CartDetailCtrl'
	}).otherwise({
		redirectTo: '/shops'
	});
});

agoraApp.controller('MainCtrl', function($scope, $http, $routeParams) {
	$.fn.raty.defaults.path = '/images';
	$scope.$on('$viewContentLoaded', function() {
		if ($scope.shop == null || $scope.shop.id != $routeParams.sid)
		{
			var params;
			if ($routeParams.sid != null)
			{
				params = {sid: $routeParams.sid};
			} else
			{
				params = {sid: 0};
			}
			$http.get("/shop.php?format=json", {params: params })
			.success(function (results) {
				$scope.shop = results.data;
				$scope.session = results.session;
			});
		}
	});
});

agoraApp.controller('MenuCtrl', function($scope, $http, $routeParams) {
});

agoraApp.controller('ItemDetailCtrl', function($scope, $http, $routeParams){
	$http.get("/item.php?format=json", {params: {iid: $routeParams.iid, sid: $routeParams.sid} })
	.success(function (results) {
		$scope.item = results.data;
	});
});

agoraApp.controller('UserDetailCtrl', function($scope, $http, $routeParams){
	$scope.login = function()
	{
		var payload = {$('lg-username')};
	};
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
		templateUrl: 'partials/item/review_editor.html',
		compile: function ($element, $attrs)
		{
			return linkFunction;
		}
	};
});

agoraApp.controller('CartDetailCtrl', function ($scope, $http, $routeParams) {
	var params;
	if ($routeParams.cid == null)
	{
		params = new Object();
	} else
	{
		params = {cid: $routeParams.cid};
	}
	$http.get("/cart.php?format=json", {params: params }).success(function (results) {
		$scope.cdata = results.data;
	});
}).directive('bag', function($compile)
{
	var linkFunction = function($scope, $element, $attrs)
	{
		$scope.$watch('scope.cdata', function(value)
		{
			var val = value || null;            
        	if (val)
        	{
				$element.find('.item_table').dataTable({
					"bDestroy": true,
					"bFilter": false
				});
			} else
			{
				$element.find('.item_table').dataTable({
					"bFilter": false
				});
			}
		});
	};
	return {
		restrict: 'E',
		scope: true,
		templateUrl: 'partials/bag/detailed.html',
		compile: function ($element, $attrs)
		{
			return linkFunction;
		}
	};	
}).directive('payment', function($compile)
{
	var linkFunction = function($scope, $element, $attrs)
	{
		var zip_codes = new Bloodhound({
		    datumTokenizer: function (d) {
		        return Bloodhound.tokenizers.whitespace(d.value);
		    },
		    queryTokenizer: Bloodhound.tokenizers.whitespace,
		    remote: {
		        url: '/zip.php?zip=%QUERY',
		        filter: function (zips) {
		            return $.map(zips.data, function (zips) {
		                return {
		                    value: zips.zip
		                };
		            });
		        }
		    }
		});
		
		// initialize the bloodhound suggestion engine
		zip_codes.initialize();
		$('#auto, #ex-postal-code').typeahead( {			
		  hint: true,
		  highlight: true,
		  minLength: 1
		},
		{
		  name: 'zips',
		  displayKey: 'value',
		  // `ttAdapter` wraps the suggestion engine in an adapter that
		  // is compatible with the typeahead jQuery plugin
		  source: zip_codes.ttAdapter()
		});
		function handleResponse(response) {
			if (response.status_code === 201) {
				var fundingInstrument = response.cards != null ? response.cards[0] : response.bank_accounts[0];
				console.log(fundingInstrament);
				// Call your backend
				jQuery.post("/credit_card.php", {
					data: {action: save, format: json},
					type: json,
					uri: fundingInstrument.href
				}, function(r) {
					// Check your backend response
					if (r.status === 201) {
						// Your successful logic here from backend ruby
					} else {
					// Your failure logic here from backend ruby
					}
				});
			} else {
			// Failed to tokenize, your error logic here
			}
		}
		$('#cc-submit').click(function (e) {
			e.preventDefault();
			var payload = {
				name: $('#cc-name').val(),
				number: $('#cc-number').val(),
				expiration_month: $('#cc-ex-month').val(),
				expiration_year: $('#cc-ex-year').val(),
				cvv: $('#ex-cvv').val(),
				address: {
					postal_code: $('#ex-postal-code').val()
				}
			};
		
			// Create credit card
			balanced.card.create(payload, handleResponse);
		});
	};
	return {
		restrict: 'E',
		scope: true,
		templateUrl: 'partials/payment_method/credit_card/edit.html',
		compile: function ($element, $attrs)
		{
			return linkFunction;
		}
	};
});