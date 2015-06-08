import {Player} from '../models/player';

//todo: communicate with server rather than providing static data
export class PlayerService {
  private _players = [
    Player.load({id: 1, name: "Tore"}),
    Player.load({id: 2, name: "Kjersti"}),
  ];


  listPlayers(): Promise<Player[]> {
    return new Promise(resolve => resolve(this._players));
  }

  getPlayerById(id: string): Promise<Player> {
    return new Promise<Player>((resolve, reject) => {
      var player = this._players.filter(p => p.id == id)[0];
      if (player !== undefined) {
        resolve(player);
      }
      else {
        reject("Cannot find player " + id);
      }
    });
  }
}
