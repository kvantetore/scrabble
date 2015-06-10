import {Player} from './player';
import * as moment from 'moment';

function parseDate(input: string): moment.Moment {
  return moment(input);
}

function serializeDate(date: moment.Moment): string {
  return moment.toString();
}

export class Game {
  id: string;
  players: Player[] = [];
  rounds: Round[] = [];
  finished: moment.Moment;

  serialize() {
    return {
      id: this.id,
      playerIds: this.players.map(p => p.id),
      rounds: this.rounds.map(round => round.serialize()),
      finished: serializeDate(this.finished),
    }
  }

  static load(data: any) {
    let game = new Game();
    game.id = data.id;
    game.players = data.players && data.players.map(p => Player.load(p)) || [];
    game.rounds = data.rounds && data.rounds.map(r => Round.load(r)) || [];
    game.finished = data.finished && parseDate(data.finished) || null;
    return game;
  }

  hasPlayer(player: Player) {
    return this.players.some(p => p.id === player.id);
  }

  addPlayer(player: Player) {
    if (player == null) {
      throw new Error("Cannot add empty player");
    }
    if (player.id == null) {
      throw new Error("Cannit add player, player is missing id");
    }
    if (this.rounds.length > 0) {
      throw new Error("Cannot add player to a started game");
    }
    if (this.hasPlayer(player)) {
      throw new Error("Cannot add player, already added");
    }

    this.players.push(player);
  }

  removePlayer(player: Player) {
    if (player == null) {
      throw new Error("Cannot remove empty player");
    }
    if (player.id == null) {
      throw new Error("Cannit remove player, player is missing id");
    }
    if (this.rounds.length > 0) {
      throw new Error("Cannot remove player from a started game");
    }
    if (!this.hasPlayer(player)) {
      throw new Error("Cannot remove player, not added");
    }

    this.players = this.players.filter(p => p.id !== player.id);
  }

  getNextPlayer() {
    let currentRound: Round = this.getCurrentRound();

    if (currentRound == null || currentRound.isCompleted(this.players.length)) {
      return this.players[0];
    } else {
      return this.players[currentRound.actions.length];
    }
  }

  getCurrentRound() {
    let currentRound: Round = null;
    if (this.rounds.length > 0) {
      currentRound = this.rounds[this.rounds.length - 1];
    }
    return currentRound;
  }

  addAction(action: Action) {
    let player = this.getNextPlayer();

    //get or create current round
    let currentRound = this.getCurrentRound();
    if (currentRound == null || currentRound.isCompleted(this.players.length)) {
      currentRound = new Round();
      this.rounds.push(currentRound);
    }

    //set correct playerId and add
    action.playerId = player.id;
    currentRound.addAction(action);
  }

  getPlayerScore(player: Player) {
    if (player == null) {
      throw new Error("Cannot find score for null player");
    }
    if (!this.players.some(p => p.id === player.id)) {
      throw new Error(`Player ${player.name} (${player.id}) is not in the player list`)
    }

    var score = 0;
    for (let round of this.rounds) {
      var action = round.actions.find(a => a.playerId === player.id);
      if (action != null) {
        score += action.score;
      }
    }

    return score;
  }


}

export class Round {
  actions: Action[] = [];

  serialize() {
    return {
      actions: this.actions.map(a => a.serialize()),
    };
  }

  static load(data: any) {
    let round = new Round();
    round.actions = data.actions && data.actions.map(a => Action.load(a)) || [];
    return round;
  }

  addAction(action: Action) {
    this.actions.push(action);
  }

  isCompleted(playerCount: number) {
    return this.actions.length >= playerCount;
  }

  getPlayerActions(players: Player[]) {
    return players.map(p => this.getPlayerAction(p));
  }

  getPlayerAction(player: Player) {
    if (player == null) {
      throw new Error("Cannot find action for null player");
    }
    if (player.id == null) {
      throw new Error("Cannot find action for player without id");
    }
    return this.actions.find(a => a.playerId == player.id);
  }
}

export class Action {
  playerId: string;
  date: moment.Moment;

  word: string
  score: number;

  serialize() {
    return {
      playerId: this.playerId,
      date: serializeDate(this.date),
      word: this.word,
      score: this.score,
    }
  }

  static load(data: any) {
    let action = new Action();
    action.playerId = data.playerId;
    action.date = data.date && parseDate(data.date) || null;
    action.word = data.word;
    action.score = data.score;
    return action;
  }
}
