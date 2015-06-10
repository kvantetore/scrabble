import {Component, View} from 'angular2/angular2';


let styles   = require('./home.css');
let template = require('./home.html');


@Component({
  selector: "home"
})
@View({
  template:`<style>${styles}</style>\n${template}`
})
export class HomeComponent {
  test: string = "my test"
}
