import {Component, OnInit} from '@angular/core';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { navItems } from '../../_nav';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  templateUrl: './default-layout.component.html'
})
export class DefaultLayoutComponent  implements OnInit {

  userData$: Observable<any>;
  isAuthenticated$: Observable<boolean>;
  emailV:string;
  
  minimized = false;
  public navItems = [...navItems];

  toggleMinimize(e) {
    this.minimized = e;
  }

  constructor(public oidcSecurityService: OidcSecurityService) {}

  ngOnInit() {
    this.isAuthenticated$ = this.oidcSecurityService.isAuthenticated$;
    this.userData$ = this.oidcSecurityService.userData$;
    this.userData$.subscribe(valU => 
      {
        if (valU != null) {
          this.emailV = valU.email;
        }
      }
    );
  }

  logout() {
    return this.oidcSecurityService.getEndSessionUrl();
  }
}
