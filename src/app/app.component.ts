import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { OidcSecurityService } from 'angular-auth-oidc-client';
@Component({
  // tslint:disable-next-line
  selector: 'body',
  template: '<router-outlet></router-outlet>'
})
export class AppComponent implements OnInit {
  title = 'CoreUI 2 for Angular 8';
  constructor(private router: Router, private oidcSecurityService: OidcSecurityService) { }

  ngOnInit() {
    this.router.events.subscribe((evt) => {
      if (!(evt instanceof NavigationEnd)) {
        return;
      }
      window.scrollTo(0, 0);
    });

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