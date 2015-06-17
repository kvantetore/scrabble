import {Component, View, coreDirectives, ElementRef} from 'angular2/angular2';
import {RouterLink, RouteConfig, Router} from 'angular2/router';

import {Game} from 'app/models/game';
import {GameService} from 'app/api/gameService';

let styles   = require('!raw!less!./home.less');
let template = require('./home.html');

@Component({
  selector: "home"
})
@View({
  template:`<style>${styles}</style>\n${template}`,
  directives: [coreDirectives, RouterLink]
})
export class HomeComponent {
  games: Game[];

  constructor(gameService: GameService, private router: Router) {
    gameService.listActiveGames()
      .then(games => {
        this.games = games;
      })
  }
  
  gameUrl(game: Game) {
    return this.router.parent.generate("play-game", {id: game.id});
  }
  
  gotoGame($event: any,game: Game) {
    $event.preventDefault();
    this.router.parent.navigate(this.gameUrl(game));
  }
}
