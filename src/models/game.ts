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
    var game = new Game();
    game.id = data.id;
    game.players = data.players && data.players.map(p => Player.load(p)) || [];
    game.rounds = data.rounds && data.rounds.map(r => Round.load(r)) || [];
    game.finished = data.finished && parseDate(data.finished) || null;
    return game;
  }

  addPlayer(player: Player) {
    if (this.rounds.length > 0) {
      throw new Error("Cannot add player to a started game");
    }

    this.players.push(player);
  }

  getNextPlayer() {
    var currentRound: Round = this.getCurrentRound();

    if (currentRound == null || currentRound.isCompleted(this.players.length)) {
      return this.players[0];
    } else {
      return this.players[currentRound.actions.length];
    }
  }

  getCurrentRound() {
    var currentRound: Round = null;
    if (this.rounds.length > 0) {
      currentRound = this.rounds[this.rounds.length - 1];
    }
    return currentRound;
  }

  addAction(action: Action) {
    var player = this.getNextPlayer();

    //get or create current round
    var currentRound = this.getCurrentRound();
    if (currentRound != null || currentRound.isCompleted(this.players.length)) {
      currentRound = new Round();
      this.rounds.push(currentRound);
    }

    //set correct playerId and add
    action.playerId = player.id;
    currentRound.addAction(action);
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
    var round = new Round();
    round.actions = data.actions && data.actions.map(a => Action.load(a)) || [];
    return round;
  }

  addAction(action: Action) {
    this.actions.push(action);
  }

  isCompleted(playerCount: number) {
    return this.actions.length >= playerCount;
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
    var action = new Action();
    action.playerId = data.playerId;
    action.date = data.date && parseDate(data.date) || null;
    action.word = data.word;
    action.score = data.score;
    return action;
  }
}
