export class Player {
  id: string;
  name: string;

  serialize() {
    return {
      id: this.id,
      name: this.name,
    }
  }

  static load(data: any) {
    var player = new Player();
    player.id = data.id;
    player.name = data.name;
    return player;
  }
}
