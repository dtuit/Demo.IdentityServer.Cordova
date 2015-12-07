var api = {
    urls: {
        // idsvr: "https://10.0.3.2:44333/core" // for Genymotion emulator
        idsvr: "https://192.168.1.75:44333" // for visual studio hyper-v emulator
    }
}
angular.module("app", ['ngOidcTokenManager'])
    .constant('api', api)
    .config(function (ngTokenManagerProvider, api) {

        var AuthConfig = {
            client_id: "implicitclient",
            authority: api.urls.idsvr + "/core",
            redirect_uri: "http://localhost/callback",
            response_type: "id_token token",
            scope: "openid profile read write",
            silent_redirect_uri: "http://localhost/callback",
            silent_renew: true,
            is_cordova: true // tells silent renew to use InAppBrowser
        };
        ngTokenManagerProvider.setAuthConfig(AuthConfig);
    })
    .controller("mainCtrl", function ($scope, ngTokenManager, $interval) {
        
        $scope.login = function () {
            ngTokenManager.redirectForTokenCordova({ options: 'location=no,toolbar=no,zoom=no,' }).then(function (res) {
                console.log("login Success", ngTokenManager.access_token)
                alert("login Success")
            }, function (err) {
                console.error(err)
                alert(err)
            });
        }
        
        $scope.logout = function (){
            ngTokenManager.redirectForLogoutCordova();
        }
        
        //Alternate way to logout
        $scope.logout2 = function (){
            ngTokenManager.removeToken();
            // clear the cookies then reset the clearcache option so that new logins are remembered 
            cordova.InAppBrowser.open("", "_blank", "hidden=yes,clearcache=yes").close();
            cordova.InAppBrowser.open("", "_blank", "hidden=yes,clearcache=no").close();
            alert("Logout Succsessful")
        }
       
        $scope.access_token_display = refresh_access_token_display(); 
        
        function refresh_access_token_display() {
            var res = {
                expires_in: ngTokenManager.expires_in,
                access_token: ngTokenManager.access_token
            }
            return JSON.stringify(res, null, 2);
        }
        $interval(function(){
            $scope.access_token_display = refresh_access_token_display()
        },100);
        
        
    });