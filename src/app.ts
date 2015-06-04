/// <reference path="./references.d.ts" />

import {Component, View, bootstrap} from 'angular2/angular2';

@Component({
  selector: "app"
})
@View({
  templateUrl: "app.html"
})
class AppComponent {
  constructor() {
  }
}

bootstrap(AppComponent);
