import {Component, View, coreDirectives, onCheck, onInit, onChange, onAllChangesDone} from 'angular2/angular2';
import {RouteConfig, Router, RouterOutlet, RouterLink} from 'angular2/router';
import {BrowserLocation} from 'angular2/src/router/browser_location';

import {HomeComponent} from './home/home';
import {NewGameComponent} from './newGame/newGame';

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
  {path: "/newGame", component: NewGameComponent, as: "newgame"},
])
export class AppComponent {
  name: string = "World";

  constructor(private router: Router, private browserLocation: BrowserLocation) {
    let uri = browserLocation.path();
    this.navigate(uri);
  }

  updateName() {
    setTimeout(() => {
      this.name = "Universe";
    }, 1000);
  }

  navigate(route: string) {
    this.router.navigate(route);
  }

  onInit(){
    console.log('I am from app\'s onInit method');
  }

  onCheck(){
    console.log('I am from app\'s onCheck method');
  }


  onChange(changes){
    console.log('I am from app\'s onChange method');
    console.log(changes);
  }

  onAllChangesDone(){
    console.log('I am from app\'s onAllChangesDone method');
  }

}
