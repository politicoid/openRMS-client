openRMSApp.factory('storageService', function ($rootScope) {
    return {
        get: function (key) {
           return localStorage.getItem(key);
        },
        put: function (key, data) {
           localStorage.setItem(key, JSON.stringify(data));
        },
       	remove: function (key) {
            localStorage.removeItem(key);
        },
        clear : function () {
            localStorage.clear();
        }
    };
});
