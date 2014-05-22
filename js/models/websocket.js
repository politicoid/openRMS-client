// From http://clintberry.com/2013/angular-js-websocket-service/

agoraApp.factory('connectionFactory', ['$q', '$rootScope', function($q, $rootScope) {
	// We return this object to anything injecting our service
	var Service = {};
	// Keep all pending requests here until they get responses
	var callbacks = {};
	// Create a unique callback ID to map requests to responses
	var currentCallbackId = 0;
	// Create our websocket object with the address to the websocket
	Service.connected = true;
	var def = $q.defer();
	Service.connected = def.promise;
	var ws = new WebSocket("ws://socialmarket.ag:8081/socket/");
	ws.onopen = function(){
		console.log("Connected");
		$rootScope.connected = true;
		def.resolve("Connected");
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
		ws.send(JSON.stringify(request));
		return defer.promise;
	}

	function listener(data) {
		var messageObj = data;
		// If an object exists with callback_id in our callbacks object, resolve it
		if(callbacks.hasOwnProperty(messageObj.callback_id)) {
			var error = messageObj.error;
			if (error == null)
				$rootScope.$apply(callbacks[messageObj.callback_id].cb.resolve(messageObj.data));
			else
				$rootScope.$apply(callbacks[messageObj.callback_id].cb.reject(error));
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

	Service.getShop = function(sid) {
		var request = {
			resource: "shop",
			operation: "read",
			data: sid
		};
		// Storing in a variable for clarity on what sendRequest returns
		var promise = sendRequest(request); 
		return promise;
	};
	Service.getShops = function() {
		var request = {
			resource: "shop",
			operation: "search",
		};
		// Storing in a variable for clarity on what sendRequest returns
		var promise = sendRequest(request); 
		return promise;
	};
	Service.getItems = function(sid) {
		var request = {
			resource: "item",
			operation: "search",
			data: {shop: sid}
		};
		return sendRequest(request); 
	};
	Service.getModels = function() {
		var request = {
			resource: "model",
			operation: "search",
		};
		return sendRequest(request); 
	};
	Service.getModel = function(resource) {
		var request = {
			resource: "model",
			operation: "search",
			data: resource
		};
		return sendRequest(request); 
	};
	// Used by admin features
	Service.getDocs = function(resource, sid) {
		if (sid == null)
			constraints = {};
		else
			constraints = {shop: sid};
		var request = {
			resource: resource,
			operation: "search",
			data: constraints
		};
		return sendRequest(request); 
	};
	Service.login = function(username, password)
	{
		var request = {
			resource: "user",
			operation: "login",
			data: {
				username: username,
				password: password
			}
		};
		return sendRequest(request); 
	};
	return Service;
}]);
