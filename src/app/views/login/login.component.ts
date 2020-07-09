import { Component, OnInit  } from '@angular/core';
import { OidcSecurityService } from 'angular-auth-oidc-client';

@Component({
  selector: 'app-dashboard',
  templateUrl: 'login.component.html'
})
export class LoginComponent implements OnInit {

  constructor(public oidcSecurityService: OidcSecurityService) {}

  ngOnInit() {
    this.oidcSecurityService.logoffAndRevokeTokens();
      this.oidcSecurityService.logoffLocal();
      this.oidcSecurityService.authorize();
  }
}