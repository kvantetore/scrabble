import {Game} from '../models/game';

export class GameService {
  private _nextId = 1;
  private _games: {[id: string]: Game} = {};

  constructor() {
    //add test game
    this.save(Game.load({
      playerIds: ["1", "2"],
      rounds: [{
        actions: [{
            playerId: "1",
            word: "banan",
            score: 10
        }, {
            playerId: "2",
            word: "eple",
            score: 10
        }]
      }, {
        actions: [{
            playerId: "1",
            word: "fly",
            score: 10
        }]
      }]
    }));
  }

  listActiveGames(): Promise<Game[]> {
    var gameList = [];
    for (var gameId in this._games) {
      if (this._games.hasOwnProperty(gameId)) {
        gameList.push(this._games[gameId])
      }
    }

    return new Promise<Game[]>(resolve => resolve(gameList));
  }

  getById(id: string) {
    return new Promise<Game>((resolve, error) => {
      let game = this._games[id];
      if (game != null) {
        resolve(game);
      }
      else {
        error(`Unable to find game with id ${id}`);
      }
    })
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
