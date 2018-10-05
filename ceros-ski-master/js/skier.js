class Skier extends Item {

  constructor() {
    super('skierRight');
    this.konamiMode = 0;
    this.points = 0;
    this.status = 5;
    this.speed = SKIER_SPEED;
    this.lives = SKIER_LIVES;

    //Skier stays pegged in the center.
    this.x = (gameWidth - this.imageWidth) / 2;
    this.y = (gameHeight - this.imageHeight) / 2;
    this.xMap = 0;
    this.yMap = 0;
    this.moveable = false;  //Skier stays pegged in the center of viewport
  }

  getAssetName () { //TODO write asset name to member variable... There shouldn't be a "get" so much as an "update".
    var skierAssetName;
    switch(this.status) {
        case 0:
            skierAssetName = 'skierCrash';
            break;
        case 1:
            skierAssetName = 'skierLeft';
            break;
        case 2:
            skierAssetName = 'skierLeftDown';
            break;
        case 3:
            skierAssetName = 'skierDown';
            break;
        case 4:
            skierAssetName = 'skierRightDown';
            break;
        case 5:
            skierAssetName = 'skierRight';
            break;  //TODO add default condition
    }
    return skierAssetName;
  }

  move () {
    var xDelta = 0;
    var yDelta = 0;

    switch(this.status) {
        case 2:
            xDelta = (-1) * Math.round(this.speed / 1.4142);	//TODO why is this rounded and case 4 isn't?
            yDelta = Math.round(this.speed / 1.4142);
            break;
        case 3:
            yDelta += this.speed;
            break;
        case 4:
            xDelta = this.speed / 1.4142;
            yDelta = this.speed / 1.4142;
            break;
    }
    this.xMap += xDelta;
    this.yMap += yDelta;
    this.points += yDelta;
  }

  toggleKonami() {
    this.konamiMode = !this.konamiMode;

    if (this.konamiMode)
    {
      this.speed = 2 * SKIER_SPEED;
    } else {
      this.speed = SKIER_SPEED;
    }
  }

  setStatus(newStatus) {
    if (newStatus < 0 || newStatus > SKIER_STATUS_COUNT) {
      console.log('Error: Invalid status provided to Skier setStatus()')
      return false;
    }

    this.status = newStatus;
    switch(newStatus) {
        case 0:
            this.assetName = 'skierCrash';
            break;
        case 1:
            this.assetName = 'skierLeft';
            break;
        case 2:
            this.assetName = 'skierLeftDown';
            break;
        case 3:
            this.assetName = 'skierDown';
            break;
        case 4:
            this.assetName = 'skierRightDown';
            break;
        case 5:
            this.assetName = 'skierRight';
            break;
        case 6:
            this.assetName = 'skierJump1';
            break;
        case 7:
            this.assetName = 'skierJump2';
            break;
        case 8:
            this.assetName = 'skierJump3';
            break;
        case 9:
            this.assetName = 'skierJump4';
            break;
        case 10:
            this.assetName = 'skierJump5';
            break;
    }
  }
};
