import {Player} from './player';
import * as moment from 'moment';

function parseDate(input: string): moment.Moment {
  return moment(input);
}

function serializeDate(date: moment.Moment): string {
  if (date == null) {
    return null;
  }
  return date.format();
}

export class Game {
  id: string;
  playerIds: string[] = [];
  rounds: Round[] = [];
  started: moment.Moment;
  finished: moment.Moment;
  
  constructor() {
    this.started = moment();
  }

  serialize() {
    return {
      id: this.id || null,
      playerIds: this.playerIds || [],
      rounds: this.rounds.map(round => round.serialize()),
      started: serializeDate(this.started),
      finished: serializeDate(this.finished),
    }
  }

  static load(data: any) {
    let game = new Game();
    game.id = data.id || null;
    game.playerIds = data.playerIds || [];
    game.rounds = data.rounds && data.rounds.map(r => Round.load(r)) || [];
    game.started = data.started && parseDate(data.started) || null;
    game.finished = data.finished && parseDate(data.finished) || null;
    return game;
  }

  hasPlayer(player: Player) {
    return this.playerIds.some(pid => pid === player.id);
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

    this.playerIds.push(player.id);
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

    this.playerIds = this.playerIds.filter(pid => pid !== player.id);
  }

  getNextPlayerId() {
    let currentRound: Round = this.getCurrentRound();

    if (currentRound == null) {
      return this.playerIds[0];
    } else {
      var playerIdIndex = this.playerIds.findIndex(pid => currentRound.getPlayerAction(pid) == null);
      if (playerIdIndex < 0 || playerIdIndex >= this.playerIds.length) {
        return this.playerIds[0];
      }
      return this.playerIds[playerIdIndex];
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
    let player = this.getNextPlayerId();

    //get or create current round
    let currentRound = this.getCurrentRound();
    if (currentRound == null || currentRound.isCompleted(this.playerIds.length)) {
      currentRound = new Round();
      this.rounds.push(currentRound);
    }

    //set correct playerId and add
    action.playerId = player;
    currentRound.addAction(action);
  }

  getPlayerScore(player: Player) {
    if (player == null) {
      throw new Error("Cannot find score for null player");
    }
    if (!this.playerIds.some(pid => pid === player.id)) {
      throw new Error(`Player ${player.name} (${player.id}) is not in the player list`)
    }

    var score = 0;
    for (let round of this.rounds) {
      var action = round.getPlayerAction(player);
      if (action != null) {
        score += action.score;
      }
    }

    return score;
  }


}

export class Round {
  actions: {[playerId: string]: Action} = {};

  serialize() {
    var actionData = {};
    Object.getOwnPropertyNames(this.actions).forEach(playerId => {
      actionData[playerId] = this.actions[playerId].serialize();
    });
    
    return {
      actions: actionData
    };
  }

  static load(data: any) {
    let round = new Round();
    round.actions = {};
    if (data.actions != null) {
      Object.getOwnPropertyNames(data.actions).forEach(playerId => {
        round.actions[playerId] = Action.load(data.actions[playerId]); 
      })
    }
    return round;
  }

  addAction(action: Action) {
    if (action.playerId == null) {
      throw new Error("Cannot add action without playerId");
    }
    this.actions[action.playerId] = action;
  }

  isCompleted(playerCount: number) {
    return Object.getOwnPropertyNames(this.actions).length >= playerCount
    ;
  }

  getPlayerActions(players: Player[]) {
    return players.map(p => this.getPlayerAction(p));
  }

  getPlayerAction(player: Player|string) {
    var playerId: string;
    if (typeof player === 'string') {
      playerId = player;
    }
    else {
      if (player == null) {
        throw new Error("Cannot find action for null player");
      }
      if (player.id == null) {
        throw new Error("Cannot find action for player without id");
      }
      playerId = player.id;
    }
    return this.actions[playerId];
  }
}

export class Action {
  playerId: string;
  date: moment.Moment;

  word: string
  score: number;

  constructor() {
    this.date = moment();
  }

  serialize() {
    return {
      playerId: this.playerId || null,
      date: serializeDate(this.date),
      word: this.word || null,
      score: this.score || null,
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
