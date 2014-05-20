agoraApp.controller('CartDetailCtrl', function ($scope, $http, $routeParams) {
	var params;
	if ($routeParams.cid == null)
	{
		params = new Object();
	} else
	{
		params = {cid: $routeParams.cid};
	}
	$http.get($scope.server+"/cart.php?format=json&callback=cart", {params: params }).success(function (results) {
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
		templateUrl: 'views/bag/detailed.html',
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
		templateUrl: 'views/payment_method/credit_card/edit.html',
		compile: function ($element, $attrs)
		{
			return linkFunction;
		}
	};
});