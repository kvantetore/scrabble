import {Component, View, coreDirectives, onCheck, onInit, onChange, onAllChangesDone} from 'angular2/angular2';
import {RouteConfig, Router, RouterOutlet, RouterLink} from 'angular2/router';
import {BrowserLocation} from 'angular2/src/router/browser_location';

import {HomeComponent} from './home/home';
import {NewGameComponent} from './newGame/newGame';
import {PlayComponent} from './play/play';

let template = require("./app.html");

@Component({
  selector: "app",
})
@View({
  template: template,
  directives: [RouterOutlet, RouterLink, coreDirectives],
  lifecycle: [onCheck, onInit, onChange, onAllChangesDone]
})
@RouteConfig([
  {path: "/home", component: HomeComponent, as: "home"},
  {path: "/newGame", component: NewGameComponent, as: "new-game"},
  {path: "/play/:id", component: PlayComponent, as: "play-game"},
])
export class AppComponent {
  constructor(private router: Router, private browserLocation: BrowserLocation) {
    let uri = browserLocation.path();
    this.router.navigate(uri);
  }
}
