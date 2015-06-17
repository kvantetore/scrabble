import {Component, View, coreDirectives, ElementRef} from 'angular2/angular2';
import {RouterLink, RouteConfig, Router} from 'angular2/router';

import {Game} from 'app/models/game';
import {Player} from 'app/models/player';
import {GameService} from 'app/api/gameService';
import {PlayerService} from 'app/api/playerService';

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
  players: Player[];

  constructor(gameService: GameService, playerService: PlayerService, private router: Router) {
    playerService.listPlayers()
      .then(players => {
        this.players = players;
      });
    
    gameService.listActiveGames()
      .then(games => {
        this.games = games;
      })
  }
  
  gameUrl(game: Game) {
    return this.router.parent.generate("play-game", {id: game.id});
  }
  
  getGamePlayers(game: Game) {
    if (this.players == null) {
      return null;
    }
    
    return game.playerIds.map(pid => this.players.find(p => p.id === pid));
  }
  
  gotoGame($event: any,game: Game) {
    $event.preventDefault();
    this.router.parent.navigate(this.gameUrl(game));
  }
}
