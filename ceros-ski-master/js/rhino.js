class Rhino extends Item {

  constructor() {
    super('rhino');
    this.status = 5;
    this.speed = 10;
    this.maxTurn = 1; //TODO calibrate this
    this.x = 0;
    this.y = 0;
    this.width = 0;
    this.height = 0;
  }
}
