import {Injectable} from 'angular2/di';

import {Game} from '../models/game';
import {FirebaseService} from './firebaseService';

@Injectable()
export class GameService {
  private _nextId = 1;
  private _games: {[id: string]: Game} = {};

  constructor(private firebase: FirebaseService) {
    // add test game
    // this.save(Game.load({
    //   playerIds: ["p1", "p2"],
    //   rounds: [{
    //     actions: {
    //       "p1": {
    //         playerId: "p1",
    //         word: "banan",
    //         score: 10
    //       },
    //       "p2": {
    //         playerId: "p2",
    //         word: "eple",
    //         score: 10
    //       }
    //     }
    //   }, {
    //     actions: {
    //       "p1": {
    //         playerId: "p1",
    //         word: "fly",
    //         score: 10
    //       }
    //     }
    //   }]
    // }))
    // .catch(error => {
    //   console.warn("unable to save test data", error);
    // });
  }

  listActiveGames(): Promise<Game[]> {
    return new Promise<Game[]>((resolve, reject) => {
      this.firebase.ref.root()
        .child("games")
        .orderByChild("finished")
        .equalTo(null)
        .once("value", snapshot => {
          var games = [];
          snapshot.forEach(child => {
            var gameData = child.val();
            gameData.id = child.key();
            games.push(Game.load(gameData));
          })
          
          resolve(games);
        }, error => {
          reject(error);
        })
    })
  }

  getById(id: string) {
    var promise = new Promise<Game>((resolve, reject) => {
      this.firebase.ref.root().child("games/" + id).once("value", snapshot => {
        //attach id
        var gameData = snapshot.val();
        gameData.id = snapshot.key();
        
        // parse game and resolve
        var game = Game.load(gameData);
        resolve(game);
      }, error => {
        reject(error);
      });
    });
    
    promise.catch(err => {
      console.log(err);
    })
    
    return promise;
  }

  save(game: Game): Promise<Game> {
    var promise = new Promise<Game>((resolve) => {
      var gameData = game.serialize();

      //If id is missing, push as a new game
      if (game.id == null) {
        var ref = this.firebase.ref.root().child("games").push(gameData, (error) => {
          if (error) {
            console.warn(error);
            throw error;
          }
          else {
            //update gameId
            var gameId = ref.key()
            game.id = gameId;
            
            //resolve promise
            resolve(game);
          }
        });
      }
      else {
        this.firebase.ref.root().child("games/" + game.id).set(gameData, (error) => {
          if (error) { 
            throw error;
          }
          else {
            resolve(game);
          }
        });
      }
    })
    
    promise.catch(error => {
      console.warn("Unable to save game", error);
    })
    
    return promise;
  }
}
