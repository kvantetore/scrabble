var Player = (function () {
    function Player() {
    }
    Player.prototype.serialize = function () {
        return {
            id: this.id,
            name: this.name
        };
    };
    Player.load = function (data) {
        var player = new Player();
        player.id = data.id;
        player.name = data.name;
        return player;
    };
    return Player;
})();
exports.Player = Player;
