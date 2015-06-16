if (typeof __decorate !== "function") __decorate = function (decorators, target, key, desc) {
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") return Reflect.decorate(decorators, target, key, desc);
    switch (arguments.length) {
        case 2: return decorators.reduceRight(function(o, d) { return (d && d(o)) || o; }, target);
        case 3: return decorators.reduceRight(function(o, d) { return (d && d(target, key)), void 0; }, void 0);
        case 4: return decorators.reduceRight(function(o, d) { return (d && d(target, key, o)) || o; }, desc);
    }
};
var di_1 = require('angular2/di');
var game_1 = require('../models/game');
var GameService = (function () {
    function GameService(firebase) {
        this.firebase = firebase;
        this._nextId = 1;
        this._games = {};
    }
    GameService.prototype.listActiveGames = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.firebase.ref.root()
                .child("games")
                .orderByChild("finished")
                .equalTo(null)
                .once("value", function (snapshot) {
                var games = [];
                snapshot.forEach(function (child) {
                    var gameData = child.val();
                    gameData.id = child.key();
                    games.push(game_1.Game.load(gameData));
                });
                resolve(games);
            }, function (error) {
                reject(error);
            });
        });
    };
    GameService.prototype.getById = function (id) {
        var _this = this;
        var promise = new Promise(function (resolve, reject) {
            _this.firebase.ref.root().child("games/" + id).once("value", function (snapshot) {
                //attach id
                var gameData = snapshot.val();
                gameData.id = snapshot.key();
                // parse game and resolve
                var game = game_1.Game.load(gameData);
                resolve(game);
            }, function (error) {
                reject(error);
            });
        });
        promise.catch(function (err) {
            console.log("Unable to get game", id, err);
        });
        return promise;
    };
    GameService.prototype.save = function (game) {
        var _this = this;
        var promise = new Promise(function (resolve) {
            var gameData = game.serialize();
            //If id is missing, push as a new game
            if (game.id == null) {
                var ref = _this.firebase.ref.root().child("games").push(gameData, function (error) {
                    if (error) {
                        console.warn(error);
                        throw error;
                    }
                    else {
                        //update gameId
                        var gameId = ref.key();
                        game.id = gameId;
                        //resolve promise
                        resolve(game);
                    }
                });
            }
            else {
                _this.firebase.ref.root().child("games/" + game.id).set(gameData, function (error) {
                    if (error) {
                        throw error;
                    }
                    else {
                        resolve(game);
                    }
                });
            }
        });
        promise.catch(function (error) {
            console.warn("Unable to save game", error);
        });
        return promise;
    };
    GameService = __decorate([
        di_1.Injectable()
    ], GameService);
    return GameService;
})();
exports.GameService = GameService;
