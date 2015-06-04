/// <reference path="./references.d.ts" />

import {Component, View, bootstrap} from 'angular2/angular2';

@Component({
  selector: "app"
})
@View({
  template: "<h1>Hello World!</h1>"
})
class AppComponent {
  constructor() {
  }
}

bootstrap(AppComponent);
