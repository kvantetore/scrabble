import {Component, View, coreDirectives} from 'angular2/angular2';

import {Game} from 'app/models/game';
import {GameService} from 'app/api/gameService';

let styles   = require('./home.css');
let template = require('./home.html');

@Component({
  selector: "home"
})
@View({
  template:`<style>${styles}</style>\n${template}`,
  directives: [coreDirectives]
})
export class HomeComponent {
  games: Game[];

  constructor(gameService: GameService) {
    gameService.listActiveGames()
      .then(games => {
        this.games = games;
      })
  }
}
