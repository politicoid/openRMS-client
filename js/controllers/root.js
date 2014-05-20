var agoraApp = angular.module('agoraApp', ['ngRoute', 'ngSanitize']);

agoraApp.config(function($routeProvider) {
	$routeProvider.when('/shops', {
		templateUrl: 'views/shop/list.html',
		controller: 'ShopListCtrl'
	}).when('/shop/:sid', {
		templateUrl: 'views/shop/detailed.html',
		controller: 'ShopDetailCtrl'
	}).when('/shop/:sid/items/', {
		templateUrl: 'views/item/list.html',
		controller: 'ItemListCtrl'
	}).when('/shop/:sid/items/:cid/', {
		templateUrl: 'views/item/list.html',
		controller: 'ItemListCtrl'
	}).when('/shop/:sid/items/:cid/:ms', {
		templateUrl: 'views/item/list.html',
		controller: 'ItemListCtrl'
	}).when('/shop/:sid/item/:iid', {
		templateUrl: 'views/item/detailed.html',
		controller: 'ItemDetailCtrl'
	}).when('/user/', {
		templateUrl: 'views/user/detailed.html',
		controller: 'UserDetailCtrl'
	}).when('/cart', {
		templateUrl: 'views/cart/detailed.html',
		controller: 'CartDetailCtrl'
	}).otherwise({
		redirectTo: '/shops'
	});
});

// From http://clintberry.com/2013/angular-js-websocket-service/

agoraApp.factory('MyService', ['$q', '$rootScope', function($q, $rootScope) {
    // We return this object to anything injecting our service
    var Service = {};
    // Keep all pending requests here until they get responses
    var callbacks = {};
    // Create a unique callback ID to map requests to responses
    var currentCallbackId = 0;
    // Create our websocket object with the address to the websocket
    var ws = new WebSocket("ws://socialmarket.ag:9000/socket/");
    
    ws.onopen = function(){  
        console.log("Socket has been opened!");  
    };
    
    ws.onmessage = function(message) {
        listener(JSON.parse(message.data));
    };

    function sendRequest(request) {
      var defer = $q.defer();
      var callbackId = getCallbackId();
      callbacks[callbackId] = {
        time: new Date(),
        cb:defer
      };
      request.callback_id = callbackId;
      console.log('Sending request', request);
      ws.send(JSON.stringify(request));
      return defer.promise;
    }

    function listener(data) {
      var messageObj = data;
      console.log("Received data from websocket: ", messageObj);
      // If an object exists with callback_id in our callbacks object, resolve it
      if(callbacks.hasOwnProperty(messageObj.callback_id)) {
        console.log(callbacks[messageObj.callback_id]);
        $rootScope.$apply(callbacks[messageObj.callback_id].cb.resolve(messageObj.data));
        delete callbacks[messageObj.callbackID];
      }
    }
    // This creates a new callback ID for a request
    function getCallbackId() {
      currentCallbackId += 1;
      if(currentCallbackId > 10000) {
        currentCallbackId = 0;
      }
      return currentCallbackId;
    }

    // Define a "getter" for getting customer data
    Service.getCustomers = function() {
      var request = {
        type: "get_customers"
      };
      // Storing in a variable for clarity on what sendRequest returns
      var promise = sendRequest(request); 
      return promise;
    };

    return Service;
}]);

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
}).directive('config', function ($scope) {
	return {
		restrict: 'E',
		link: function ($scope, $element, $attrs)
		{
			el_server = $element.find('server').first();
			if (el_server != null)
			{
				$scope.server = el_sever.inner();
			}
		}
	};
});