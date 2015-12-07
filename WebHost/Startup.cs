using System;
using System.Collections.Generic;
using System.Security.Claims;
using System.Threading.Tasks;
using Configuration;
using IdentityServer3.Core.Configuration;
using Microsoft.Owin;
using Owin;
using Serilog;

using Microsoft.Owin.Security.Google;

[assembly: OwinStartup(typeof(WebHost.Startup))]

namespace WebHost
{
    public class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            Log.Logger = new LoggerConfiguration()
                .WriteTo.Trace(outputTemplate: "{Timestamp} [{Level}] ({Name}){NewLine} {Message}{NewLine}{Exception}")
                .CreateLogger();

            var factory = new IdentityServerServiceFactory()
                        .UseInMemoryUsers(Users.Get())
                        .UseInMemoryClients(Clients.Get())
                        .UseInMemoryScopes(Scopes.Get());

            app.Map("/core", core =>
            {
                var options = new IdentityServerOptions
                {
                    SigningCertificate = Certificate.Load(),
                    Factory = factory,
                };
                
                core.UseIdentityServer(options);
            });
        }
    }
}
