import {Game} from '../models/game';

export class GameService {
  private _nextId = 1;
  private _games: {[id: string]: Game} = {};

  listActiveGames(): Promise<Game[]> {
    var gameList = [];
    for (var gameId in this._games) {
      if (this._games.hasOwnProperty(gameId)) {
        gameList.push(this._games[gameId])
      }
    }

    return new Promise<Game[]>(resolve => resolve(gameList));
  }

  save(game: Game): Promise<Game> {
    //Add id if missing
    if (game.id == null) {
      game.id = this._nextId.toString();
      this._nextId += 1;
    }

    //save game
    this._games[game.id] = game;

    return new Promise<Game>(resolve => resolve(game))
  }
}
