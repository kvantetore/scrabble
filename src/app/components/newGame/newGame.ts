import {Component, View, coreDirectives, CSSClass} from 'angular2/angular2';
import {Router} from 'angular2/router';

import {PlayerService} from 'app/api/playerService';
import {GameService} from 'app/api/gameService';
import {Player} from 'app/models/player';
import {Game} from 'app/models/game';

let styles   = require('./newGame.css');
let template = require('./newGame.html');

@Component({
  selector: "new-game"
})
@View({
  template:`<style>${styles}</style>\n${template}`,
  directives: [coreDirectives]
})
export class NewGameComponent {
  availablePlayers: Player[];
  game: Game;

  constructor(private playerService: PlayerService, private gameService: GameService, private router: Router) {
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

  startGame() {
    this.gameService.save(this.game)
      .then(game => {
        this.router.nav
      })
  }
}
