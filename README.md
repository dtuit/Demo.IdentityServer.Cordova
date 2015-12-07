Demo.IdentityServer.Cordova
=====

A Demo [Cordova](https://cordova.apache.org/) app configured to use [IdentityServer3](https://github.com/IdentityServer/IdentityServer3) and [oidc-token-manager](https://github.com/IdentityModel/oidc-token-manager), [InAppBrowser](https://github.com/apache/cordova-plugin-inappbrowser), and [AngularJS](https://github.com/angular).

#### Note

 - added method [redirectForTokenCordova()]() so oidc-token-manager can use InAppBrowser
 - [angular wrapper]() for oidc-token-manager

tested to work on Android and Windows Phone 10

###Steps I followed to set up.

to allow the Visual Studio 2015 emulators to access a website running on the localhost (on iis-express)

open the `applicationhost.config` for iis-express at `$(solutionDir)\.vs\config\applicationhost.config`

add a new binding to the site
`<binding protocol="https" bindingInformation=":44333:*" />`

next to allow access to the custom binding.
from an administrative cmd run 
`netsh http add urlacl https://*:44333/ user=everyone`

run ipconfig and get your internet adapters IP address

you should now be able to access the identityServer website from `https://<IP>:44333/core` within the emulator.