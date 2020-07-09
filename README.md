# OIDC Client integration with Coreui angular demo
This is an example of how to integrate [the `angular-auth-oidc-client` library](https://www.npmjs.com/package/angular-auth-oidc-client) with [CoreUI Template for Angular version](https://github.com/coreui/coreui-angular) using Code Flow Authentication.

## Usage

This repository has been started from clone the [CoreUI Template for Angular version](https://github.com/coreui/coreui-angular).
To use the repository:

1. Clone this repository
1. Run `npm install` to get the dependencies
1. Create an OpenID Connect App (for example on [Okta](https://developer.okta.com/blog/2017/04/17/angular-authentication-with-oidc?&_ga=2.149889334.1666385962.1594288019-1402970635.1591772239#create-an-openid-connect-app-in-okta) ) and setting clientId and statsServer on enviroment.ts
1. Run `ng serve --open` to get it running on [http://localhost:4200](http://localhost:4200) 
1. Login on page of your Identity server


## How to integrate OIDC Client

Install the library angular-auth-oidc-client
``` bash
npm install angular-auth-oidc-client --save
```

Initialize the library at startup of application modifing and adding some configurations in app.module.ts:
``` ts
import { AuthModule, LogLevel, OidcConfigService } from 'angular-auth-oidc-client';
import { APP_INITIALIZER, NgModule } from '@angular/core';
import { environment } from '../environments/environment';
...
export function configureAuth(oidcConfigService: OidcConfigService) {
  return () => {
      oidcConfigService.withConfig({
        stsServer: environment.stsServer,
        redirectUrl: window.location.origin,
        clientId: environment.clientId,
        scope: 'openid profile email',
        responseType: 'code',
        triggerAuthorizationResultEvent: true,
        postLogoutRedirectUri: `${window.location.origin}/#/login`,
        startCheckSession: false,
        silentRenew: true,
        silentRenewUrl: `${window.location.origin}/silent-renew.html`,
        postLoginRoute: '/',
        forbiddenRoute: '/forbidden',
        unauthorizedRoute: '/unauthorized',
        logLevel: LogLevel.Debug,
        historyCleanupOff: true,
        autoUserinfo: true
    });
  }
}
...
@NgModule({
  imports: [
    ...
    AuthModule.forRoot() 
  ],

```
>For configure the parameters of oidc-client use the official guide [OIDC Client](https://github.com/damienbod/angular-auth-oidc-client)


Add import to app.component.ts and modify the app.component.ts to redirect to login page if the user is not authenticated.
``` ts
import { OidcSecurityService } from 'angular-auth-oidc-client';
...
export class AppComponent implements OnInit {
  ...
  ngOnInit() {
    
    ...

    //Check if user is authenticate otherwise redirect to login page
    this.oidcSecurityService.checkAuth().subscribe((isAuthenticated) => { 
        if (!isAuthenticated) { 
            if ('/login' !== window.location.pathname) {
                this.write('redirect', window.location.pathname);
                this.router.navigate(['/login']);
            }
        }
        if (isAuthenticated) { 
            this.navigateToStoredEndpoint();
        }
    });
  }

  private navigateToStoredEndpoint() {
    const path = this.read('redirect');

    if (this.router.url === path) {
        return;
    }

    if (path.toString().includes('/unauthorized')) {
        this.router.navigate(['/']);
    } else {
        this.router.navigate([path]);
    }
  }

  private read(key: string): any {
    const data = localStorage.getItem(key);
    if (data) {
        return JSON.parse(data);
    }
    return;
  }

  private write(key: string, value: any): void {
    localStorage.setItem(key, JSON.stringify(value));
  }
}
```

For redirect to the Identity server login page you can add Login component (see folder app/views/login) to app.routing.ts and on app.module.ts
``` ts
import { LoginComponent } from './views/login/login.component';
...
 declarations: [
    ...
    LoginComponent,
    ...
  ],
```


Add the page **silent-renew.html** in folder src, for silent renew token and, setting the values of enviroment.ts or enviroment.prod.ts for the identity server:

1. statsServer: URL of Oauth Identity server
1. clientId: Client id for Identity server


> In this example the user information will be shown in dashboard.component.ts and in the default-layout.component.ts will show the logout function.