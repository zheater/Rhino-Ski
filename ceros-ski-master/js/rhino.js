class Rhino extends Item {

  constructor() {
    super('rhino');
    this.status = 5;
    this.speed = 1.2 * SKIER_SPEED;

    //He's fast but he's also fat so he can't turn as fast as you can.
    this.maxTurn = 1000;  //TODO calibrate this
    this.x = gameWidth / 40;
    this.y = gameHeight / 40;
    this.angle = null;
  }

  moveToward(target) {
    //Calculate direction
    var angleHolder = Math.atan((this.y - target.y) / (this.x - target.x));
    if (angleHolder < 0)
      angleHolder += 2 * 3.1415926;
//alert(angleHolder);
//alert('ry: ' + this.y);
//alert(target.y);
//alert('rx: ' + this.x);
//alert(target.x);
    if (this.angle == null || Math.abs(angleHolder - this.angle) <= this.maxTurn) {
alert(angleHolder)
      this.angle = angleHolder;
    } else if (angleHolder < this.angle) {
      this.angle -= this.maxTurn;
    } else {
      this.angle += this.maxTurn;
    }


//alert(this.y);
//alert(target.y);
//alert(this.x);
//alert(target.x);
//alert(angle * 360 / (2 * 3.1415926));
    //TODO make rhino clickable with this link
    //HERE I COME  https://www.youtube.com/watch?v=TPQQ5qK-soM
    this.x += this.speed * Math.cos(this.angle);
    this.y += this.speed * Math.sin(this.angle);
  }
}
