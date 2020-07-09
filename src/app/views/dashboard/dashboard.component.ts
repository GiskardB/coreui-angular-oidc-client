import {Component, OnInit} from '@angular/core';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { Observable } from 'rxjs';

@Component({
  templateUrl: 'dashboard.component.html'
})
export class DashboardComponent  implements OnInit {

  userData$: Observable<any>;
  isAuthenticated$: Observable<boolean>;
  claims:string;

  constructor(public oidcSecurityService: OidcSecurityService) {}

  ngOnInit() {
    this.isAuthenticated$ = this.oidcSecurityService.isAuthenticated$;
    this.userData$ = this.oidcSecurityService.userData$;
    this.userData$.subscribe(valU => 
      {
        if (valU != null) {
          this.claims = valU;
        }
      }
    );
  }
}
