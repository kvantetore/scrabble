import {Component, View, coreDirectives, CSSClass} from 'angular2/angular2';
import {Router, RouteParams} from 'angular2/router';
import {FormBuilder, ControlGroup, Control, formDirectives, Validators} from 'angular2/forms';

import {GameService} from 'app/api/gameService';
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

  actionForm: ControlGroup;
  wordInput: Control;
  scoreInput: Control;

  constructor(
    private gameService: GameService,
    private router: Router,
    private routeParams: RouteParams,
    formBuilder: FormBuilder
  ) {
    var gameId = routeParams.get("id");
    if (gameId == null) {
      throw new Error("Missing route parameter 'id'");
    }

    gameService.getById(gameId)
      .then(game => {
        this.game = game;
      });

    //create form
    this.actionForm = formBuilder.group({
      word: ["", Validators.required],
      score: [0, Validators.required],
    });
    this.wordInput = this.actionForm.controls.word;
    this.scoreInput = this.actionForm.controls.score;

    // this.actionForm.valueChanges.observer({
    //   next: (change) => {
    //     console.log("change", change);
    //   }
    // });
  }

  getPlayerScore(player: Player) {
    if (this.game == null) {
      return null;
    }

    return this.game.getPlayerScore(player);
  }

  submitActionForm(e) {
    e.preventDefault();

    if (this.game == null) {
      throw new Error("Game is not loaded yet, cannot add action")
    }
    if (!(<any>this.actionForm).valid) {
      return;
    }

    var action = new Action();
    action.score = Number(this.scoreInput.value);
    action.word = this.wordInput.value;
    this. game.addAction(action);
  }
}
