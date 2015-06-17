import {Component, View, coreDirectives, onCheck, onInit, onChange, onAllChangesDone} from 'angular2/angular2';
import {RouteConfig, Router, RouterOutlet, RouterLink} from 'angular2/router';
import {BrowserLocation} from 'angular2/src/router/browser_location';

import {HomeComponent} from './home/home';
import {NewGameComponent} from './newGame/newGame';
import {PlayComponent} from './play/play';
import {WelcomeComponent} from './welcome/welcome';
import {AuthService} from 'app/api/authService';

let template = require("./app.html");
let styles = require("!raw!less!./app.less");

@Component({
  selector: "app",
})
@View({
  template: `<style>${styles}</style>${template}`,
  directives: [RouterOutlet, RouterLink, coreDirectives, HomeComponent, NewGameComponent],
  lifecycle: [onCheck, onInit, onChange, onAllChangesDone]
})
@RouteConfig([
  { path: "/", component: WelcomeComponent, as: "welcome" },
  { path: "/home", component: HomeComponent, as: "home" },
  { path: "/newGame", component: NewGameComponent, as: "new-game" },
  { path: "/play/:id", component: PlayComponent, as: "play-game" },
])
export class AppComponent {
  get hasAuth() {
    return this.auth.hasAuth;
  }
  
  getAuth() {
    return this.auth.hasAuth;
  }

  constructor(private router: Router, private browserLocation: BrowserLocation, private auth: AuthService) {
    let uri = browserLocation.path();

    //navigates to welcome if not authenticated, otherwise to the requested uri
    var url = this.hasAuth ? uri : "/";
    this.router.navigate(url);
  }

  logOut(e: Event) {
    e.preventDefault();

    if (this.hasAuth) {
      this.auth.logOut();
      this.router
        .navigate("/");
    }
  }
}
