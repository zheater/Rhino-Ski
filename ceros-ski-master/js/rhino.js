class Rhino extends Item {

  constructor() {
    super('rhino');
    this.status = RHINO_SLEEPING;
    this.speed = SKIER_SPEED / 5;

    this.angle = null;
    this.moveable = false;
  }

  moveToward(target) {
    //Calculate direction
    if (this.x == target.x) {
      if (this.y > target.y)
        angleHolder = 1 / 2 * 3.1415926;
      else
        angleHolder = 3 / 2 * 3.1415926;
    } else {
      var angleHolder = Math.atan((this.y - target.y) / (this.x - target.x));
      if (angleHolder < 0)
        angleHolder += 2 * 3.1415926;
    }

    //HERE I COME  https://www.youtube.com/watch?v=RfmWcJY4II4
    this.angle = angleHolder;
    this.x += this.speed * Math.cos(this.angle);
    this.y += this.speed * Math.sin(this.angle);
  }
}
