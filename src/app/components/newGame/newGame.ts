import {Component, View, coreDirectives} from 'angular2/angular2';

import {PlayerService} from 'app/api/playerService';
import {Player} from 'app/models/player';
import {Game} from 'app/models/game';

let styles   = require('./newGame.css');
let template = require('./newGame.html');

@Component({
  selector: "new-game"
})
@View({
  // templateUrl: "newGame/newGame.html",
  template:`<style>${styles}</style>\n${template}`,
  directives: [
    coreDirectives
  ]
})
export class NewGameComponent {
  availablePlayers: Player[];
  game: Game;

  constructor(private playerService: PlayerService) {
    this.game = new Game();

    playerService.listPlayers()
      .then(players => {
        this.availablePlayers = players;
      })
  }

  isPlayerSelected(player: Player) {
    return this.game.hasPlayer(player);
  }

  togglePlayerSelected(player: Player) {
    if (this.isPlayerSelected(player)) {
      this.game.removePlayer(player);
    }
    else {
      this.game.addPlayer(player);
    }
  }
}
