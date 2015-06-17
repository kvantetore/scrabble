import {Component, View, coreDirectives, ElementRef} from 'angular2/angular2';
import {Router, RouteParams} from 'angular2/router';
import {FormBuilder, ControlGroup, Control, formDirectives, Validators} from 'angular2/forms';

import {GameService} from 'app/api/gameService';
import {PlayerService} from 'app/api/playerService';
import {Player} from 'app/models/player';
import {Game, Action} from 'app/models/game';

let styles   = require('!raw!less!./play.less');
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
    private elem: ElementRef,
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
      score: ["", Validators.required],
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
    
    var score = Number(this.scoreInput.value);
    if (isNaN(score)) {
      this.scoreInput.updateValue("");
      throw new Error("Score is not a number")
    }

    //add action
    var action = new Action();
    action.score = score;
    action.word = this.wordInput.value;
    this.game.addAction(action);

    //save game
    this.gameService.save(this.game);

    //clear actionForm
    this.scoreInput.updateValue("");
    this.wordInput.updateValue("");
  }
  
  showFinishGameDialog() {
    var dialogElem = this.elem.domElement.getElementsByClassName("finish-game-dialog")[0];
    dialogElem.toggle();
  }
  
  showDeleteGameDialog() {
    var dialogElem = this.elem.domElement.getElementsByClassName("delete-game-dialog")[0];
    dialogElem.toggle();
  }
  
  clickMenu($event: Event) {
    var target = <Element>$event.target;
    var menu = null;
    
    //find sibling menu
    if (menu == null) {
      function findNextSibling(elem: Node, elementName: string) {
        var next = elem.nextSibling;
        if (next == null) {
          return null;
        }
        if (next.localName === elementName) {
          return next;
        }
        return findNextSibling(next, elementName);
      } 
      
      var menu = findNextSibling(target, "custom-dropdown-list");
    }
    
    if (menu == null) {
      console.warn("next sibling is not <custom-dropdown-list>", target)
    }
    
    //call Polymer.IronOverlayBehavior.toggle
    (<any>menu).toggle();
  }
  
  closeMenu($event: Event) {
    var target = <Element>$event.target;

    //call Polymer.IronOverlayBehavior.toggle
    (<any>target).toggle();
  }
  
  finishGame() {
    if (this.game == null) {
      throw new Error("Game is not loaded yet, cannot add action")
    }
    if (this.game.isFinished) {
      throw new Error("Game is already finished, cannot finish");
    }
    
    this.game.finishGame();
    this.gameService.save(this.game);
  }
  
  reopenGame() {
    if (this.game == null) {
      throw new Error("Game is not loaded yet, cannot add action")
    }
    if (this.game.finished == null) {
      throw new Error("Game is not finished, cannot repoen");
    }
    
    this.game.reopenGame();
    this.gameService.save(this.game);
  }
}
