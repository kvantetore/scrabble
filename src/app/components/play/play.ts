import {Component, View, coreDirectives, CSSClass} from 'angular2/angular2';
import {Router, RouteParams} from 'angular2/router';
import {FormBuilder, ControlGroup, Control, formDirectives, Validators} from 'angular2/forms';

import {GameService} from 'app/api/gameService';
import {PlayerService} from 'app/api/playerService';
import {Player} from 'app/models/player';
import {Game, Action} from 'app/models/game';

let styles   = require('./play.css');
let template = require('./play.html');

@Component({
  selector: "play"
})
@View({
  template:`<style>${styles}</style>\n${template}`,
  directives: [coreDirectives, formDirectives]
})
export class PlayComponent {
  game: Game;
  players: Player[];

  actionForm: ControlGroup;
  wordInput: Control;
  scoreInput: Control;

  constructor(
    private gameService: GameService,
    private playerService: PlayerService,
    private router: Router,
    private routeParams: RouteParams,
    formBuilder: FormBuilder
  ) {
    var gameId = routeParams.get("id");
    if (gameId == null) {
      throw new Error("Missing route parameter 'id'");
    }
    
    //load game and players
    gameService.getById(gameId)
      .then(game => this.game = game)
      .then(() => this.playerService.listPlayers())
      .then(allPlayers => {
        this.players = this.game.playerIds.map(pid => allPlayers.find(player => player.id == pid));
      }); 

    //create form
    this.actionForm = formBuilder.group({
      word: ["", Validators.required],
      score: [0, Validators.required],
    });
    this.wordInput = this.actionForm.controls.word;
    this.scoreInput = this.actionForm.controls.score;
  }

  getPlayerScore(player: Player) {
    if (this.game == null) {
      return null;
    }

    return this.game.getPlayerScore(player);
  }
  
  getNextPlayer() {
    var nextPlayerId = this.game.getNextPlayerId();
    return this.players.find(p => p.id == nextPlayerId);
  }

  submitActionForm(e) {
    e.preventDefault();

    if (this.game == null) {
      throw new Error("Game is not loaded yet, cannot add action")
    }
    if (!(<any>this.actionForm).valid) {
      return;
    }

    //add action
    var action = new Action();
    action.score = Number(this.scoreInput.value);
    action.word = this.wordInput.value;
    this.game.addAction(action);

    //save game
    this.gameService.save(this.game);

    //clear actionForm
    this.scoreInput.updateValue("");
    this.wordInput.updateValue("");
  }
}
