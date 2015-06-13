import {Component, View, coreDirectives} from 'angular2/angular2';
import {Router} from 'angular2/router';

import {AuthService} from 'app/api/authService';

let styles   = require('./welcome.css');
let template = require('./welcome.html');

@Component({
  selector: "welcome"
})
@View({
  template:`<style>${styles}</style>\n${template}`,
  directives: [coreDirectives]
})
export class WelcomeComponent {
  loginError: string;
  
  get hasError() {
    return this.loginError != null;
  }
  
  constructor(private router: Router, private auth: AuthService) {
  }
  
  authGoogle() {
    this.ensureAuth("google");
  }
  
  authFacebook() {
    this.ensureAuth("facebook");
  }
  
  private ensureAuth(provider: string) {
    this.auth.ensureAuth(provider)
      .then(() => {
        this.loginError = null;
        this.router.parent.navigate("/home");
      })
      .catch((error: Error) => {
        this.loginError = error.message;
      });
  }
}
