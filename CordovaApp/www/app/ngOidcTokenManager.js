(function(){
    
angular.module("ngOidcTokenManager", [])
    .provider("ngTokenManager", _tokenManagerProvider())
    .factory("notifyingService", _notifyingService);

function _tokenManagerProvider() {
    return function () {

        var _authConfig = {};
        var isSetManually = false;

        this.setAuthConfig = function (authConfig) {
            _authConfig = authConfig;
            isSetManually = true;
        };

        this.getAuthConfig = function () {
            return _authConfig;
        };

        this.$get = ['$injector', 'OidcTokenManager', '$rootScope', '$log', "notifyingService",
            function ($injector, OidcTokenManager, $rootScope, $log, notifyingService) {
                
                if (!isSetManually) {
                    try {
                        _authConfig = $injector.get("authConfig");
                    } catch (err) {
                        $log.warn("OidcTokenManager authConfig not set");
                    }
                }

                var mgr = new OidcTokenManager(_authConfig);

                var applyFuncs = [
                    "_callTokenRemoved", "_callTokenExpiring",
                    "_callTokenExpired", "_callTokenObtained",
                    "_callSilentTokenRenewFailed"
                ];

                applyFuncs.forEach(function (name) {
                    var tmp = mgr[name].bind(mgr);
                    //cause a $digest to occur on when calling these functions.
                    mgr[name] = function () {
                        $rootScope.$applyAsync(function () {
                            tmp();
                        });
                    }
                });

                //explicit event ids
                var events = {
                    tokenRemoved: "token-removed",
                    tokenExpiring: "token-expiring", tokenExpired: "token-expired",
                    tokenObtained: "token-obtained",
                    silentRenewFailed: "silent-renew-failed"
                };

                mgr.events = events;

                //add notify callbacks to the existing system.
                mgr.addOnTokenRemoved(function notifyOnTokenRemoved() { notifyingService.notify(events.tokenRemoved); });
                mgr.addOnTokenExpiring(function notifyOnTokenExpiring() { notifyingService.notify(events.tokenExpiring); });
                mgr.addOnTokenExpired(function notifyOnTokenExpired() { notifyingService.notify(events.tokenExpired); });
                mgr.addOnTokenObtained(function notifyOnTokenObtained() { notifyingService.notify(events.tokenObtained); });
                mgr.addOnSilentTokenRenewFailed(function notifyOnSilentRenewFailed() { notifyingService.notify(events.silentRenewFailed); });

                //explicit subscription events
                mgr.subscribeTo = {
                    tokenRemoved: function ($scope, callback) { return notifyingService.subscribe($scope, events.tokenRemoved, callback) },
                    tokenExpiring: function ($scope, callback) { return notifyingService.subscribe($scope, events.tokenExpiring, callback) },
                    tokenExpired: function ($scope, callback) { return notifyingService.subscribe($scope, events.tokenExpired, callback) },
                    tokenObtained: function ($scope, callback) { return notifyingService.subscribe($scope, events.tokenObtained, callback) },
                    silentRenewFailed: function ($scope, callback) { return notifyingService.subscribe($scope, events.silentRenewFailed, callback) }
                }

                return mgr;
            }
        ];
    }
}

_notifyingService.$inject = ['$rootScope'];
function _notifyingService($rootScope) {
    return {
        subscribe: function (scope, evnt, callback) {
            var handler = $rootScope.$on(evnt, callback);
            scope.$on('$destroy', handler);
            //return the un-sub callback to the subscriber;
            return handler;
        },

        notify: function (evnt) {
            $rootScope.$emit(evnt);
        }
    };
}

(function (angular) {
    var model = document.getElementById("OidcModel");

    if (model !== null) {
        model = JSON.parse(model.textContent.trim());
        for (var key in model) {
            if (model.hasOwnProperty(key)) {
                angular.module("ngOidcTokenManager").constant(key, model[key]);
            }
        }
    }
    angular.module("ngOidcTokenManager").constant("OidcTokenManager", OidcTokenManager);
})(angular);

})()
