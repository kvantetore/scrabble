import {Component, View, coreDirectives, onCheck, onInit, onChange, onAllChangesDone} from 'angular2/angular2';

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
  ],
  lifecycle: [onCheck, onInit, onChange, onAllChangesDone]
})
export class NewGameComponent {
  name: string = "Test";
  availablePlayers: Player[];
  game: Game;

  constructor(private playerService: PlayerService) {
    this.game = new Game();

    playerService.listPlayers()
      .then(players => {
        this.availablePlayers = players;
        setTimeout(() => {
          this.name = players[0].name;
        }, 1000)
        console.log(this.availablePlayers);
      })
  }

  isPlayerSelected(player: Player) {
    return this.game.hasPlayer(player);
  }

  togglePlayerSelect(player: Player) {
    if (this.isPlayerSelected(player)) {
      this.game.addPlayer(player);
    }
    else {
      this.game.removePlayer(player);
    }
  }

    onInit(){
      console.log('I am from newGame\'s onInit method');
    }

    onCheck(){
      console.log('I am from newGame\'s onCheck method');
    }


    onChange(changes){
      console.log('I am from newGame\'s onChange method');
      console.log(changes);
    }

    onAllChangesDone(){
      console.log('I am from newGame\'s onAllChangesDone method');
    }


}
