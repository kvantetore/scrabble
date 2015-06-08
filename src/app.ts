/// <reference path="./references.d.ts" />

import {Component, View, bootstrap} from 'angular2/angular2';
import {RouteConfig, Router, RouterOutlet, RouterLink, routerInjectables} from 'angular2/router';
import {BrowserLocation} from 'angular2/src/router/browser_location';
import {PlayerService} from './api/playerService';
import {Player} from './models/player';

import {HomeComponent} from './home/home';
import {NewGameComponent} from './newGame/newGame';

@Component({
  selector: "app",
})
@View({
  templateUrl: "app.html",
  directives: [RouterOutlet, RouterLink]
})
@RouteConfig([
  {path: "/home", component: HomeComponent, as: "home"},
  {path: "/newGame", component: NewGameComponent, as: "new-game"},
])
class AppComponent {
  player: Player;

  constructor(private router: Router, private browserLocation: BrowserLocation) {
    let uri = browserLocation.path();
    router.navigate(uri);
  }
}

bootstrap(AppComponent, [
  PlayerService,
  routerInjectables
]);
