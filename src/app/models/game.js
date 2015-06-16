var moment = require('moment');
function parseDate(input) {
    return moment(input);
}
function serializeDate(date) {
    if (date == null) {
        return null;
    }
    return date.format();
}
var Game = (function () {
    function Game() {
        this.playerIds = [];
        this.rounds = [];
        this.started = moment();
    }
    Game.prototype.serialize = function () {
        return {
            id: this.id || null,
            playerIds: this.playerIds || [],
            rounds: this.rounds.map(function (round) { return round.serialize(); }),
            started: serializeDate(this.started),
            finished: serializeDate(this.finished)
        };
    };
    Game.load = function (data) {
        var game = new Game();
        game.id = data.id || null;
        game.playerIds = data.playerIds || [];
        game.rounds = data.rounds && data.rounds.map(function (r) { return Round.load(r); }) || [];
        game.started = data.started && parseDate(data.started) || null;
        game.finished = data.finished && parseDate(data.finished) || null;
        return game;
    };
    Game.prototype.hasPlayer = function (player) {
        return this.playerIds.some(function (pid) { return pid === player.id; });
    };
    Game.prototype.addPlayer = function (player) {
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
    };
    Game.prototype.removePlayer = function (player) {
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
        this.playerIds = this.playerIds.filter(function (pid) { return pid !== player.id; });
    };
    Game.prototype.getNextPlayerId = function () {
        var currentRound = this.getCurrentRound();
        if (currentRound == null) {
            return this.playerIds[0];
        }
        else {
            var playerIdIndex = this.playerIds.findIndex(function (pid) { return currentRound.getPlayerAction(pid) == null; });
            if (playerIdIndex < 0 || playerIdIndex >= this.playerIds.length) {
                return this.playerIds[0];
            }
            return this.playerIds[playerIdIndex];
        }
    };
    Game.prototype.getCurrentRound = function () {
        var currentRound = null;
        if (this.rounds.length > 0) {
            currentRound = this.rounds[this.rounds.length - 1];
        }
        return currentRound;
    };
    Game.prototype.addAction = function (action) {
        var player = this.getNextPlayerId();
        //get or create current round
        var currentRound = this.getCurrentRound();
        if (currentRound == null || currentRound.isCompleted(this.playerIds.length)) {
            currentRound = new Round();
            this.rounds.push(currentRound);
        }
        //set correct playerId and add
        action.playerId = player;
        currentRound.addAction(action);
    };
    Game.prototype.getPlayerScore = function (player) {
        if (player == null) {
            throw new Error("Cannot find score for null player");
        }
        if (!this.playerIds.some(function (pid) { return pid === player.id; })) {
            throw new Error("Player " + player.name + " (" + player.id + ") is not in the player list");
        }
        var score = 0;
        for (var _i = 0, _a = this.rounds; _i < _a.length; _i++) {
            var round = _a[_i];
            var action = round.getPlayerAction(player);
            if (action != null) {
                score += action.score;
            }
        }
        return score;
    };
    Game.prototype.finishGame = function () {
        this.finished = moment();
    };
    return Game;
})();
exports.Game = Game;
var Round = (function () {
    function Round() {
        this.actions = {};
    }
    Round.prototype.serialize = function () {
        var _this = this;
        var actionData = {};
        Object.getOwnPropertyNames(this.actions).forEach(function (playerId) {
            actionData[playerId] = _this.actions[playerId].serialize();
        });
        return {
            actions: actionData
        };
    };
    Round.load = function (data) {
        var round = new Round();
        round.actions = {};
        if (data.actions != null) {
            Object.getOwnPropertyNames(data.actions).forEach(function (playerId) {
                round.actions[playerId] = Action.load(data.actions[playerId]);
            });
        }
        return round;
    };
    Round.prototype.addAction = function (action) {
        if (action.playerId == null) {
            throw new Error("Cannot add action without playerId");
        }
        this.actions[action.playerId] = action;
    };
    Round.prototype.isCompleted = function (playerCount) {
        return Object.getOwnPropertyNames(this.actions).length >= playerCount;
    };
    Round.prototype.getPlayerActions = function (players) {
        var _this = this;
        return players.map(function (p) { return _this.getPlayerAction(p); });
    };
    Round.prototype.getPlayerAction = function (player) {
        var playerId;
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
    };
    return Round;
})();
exports.Round = Round;
var Action = (function () {
    function Action() {
        this.date = moment();
    }
    Action.prototype.serialize = function () {
        return {
            playerId: this.playerId || null,
            date: serializeDate(this.date),
            word: this.word || null,
            score: this.score || null
        };
    };
    Action.load = function (data) {
        var action = new Action();
        action.playerId = data.playerId;
        action.date = data.date && parseDate(data.date) || null;
        action.word = data.word;
        action.score = data.score;
        return action;
    };
    return Action;
})();
exports.Action = Action;
