class Skier extends Item {

  constructor() {
    super('skierRight');
    this.konamiMode = 0;
    this.points = 0;
    this.status = SKIER_RIGHT;
    this.speed = SKIER_SPEED;
    this.lives = SKIER_LIVES;
    this.eaten = false;

    //Skier stays pegged in the center of viewport
    this.moveable = false;
    this.x = (gameWidth - this.imageWidth) / 2;
    this.y = (gameHeight - this.imageHeight) / 2;
    this.xMap = 0;
    this.yMap = 0;
    this.jumping = false;
    this.animationCount = 0;
  }

  move () {
    switch(this.status) {
            case 0:
                this.xMap = 0;
                this.yMap = 0;
                break;
            case 2:
                this.xMap = (-1) * this.speed / 1.4142;
                this.yMap = this.speed / 1.4142;
                this.points += this.speed / 1.4142;
                break;
            case 3:
                this.yMap = this.speed;
                this.points += this.speed;
                break;
            case 4:
                this.xMap = this.speed / 1.4142;
                this.yMap = this.speed / 1.4142;
                this.points += this.speed / 1.4142;
                break;
            case 6:
                this.yMap = this.speed;
                this.points += this.speed;
                if (this.animationCount >= SKIER_ANIMATION_COUNT) {
                  this.setStatus(SKIER_JUMP_2);
                  this.animationCount = 0;
                } else {
                  this.animationCount++;
                }
                break;
            case 7:
                this.yMap = this.speed;
                this.points += this.speed;
                if (this.animationCount >= SKIER_ANIMATION_COUNT) {
                  this.setStatus(SKIER_JUMP_3);
                  this.animationCount = 0;
                } else {
                  this.animationCount++;
                }
                break;
            case 8:
                this.yMap = this.speed;
                this.points += this.speed;
                if (this.animationCount >= SKIER_ANIMATION_COUNT) {
                  this.setStatus(SKIER_JUMP_4);
                  this.animationCount = 0;
                } else {
                  this.animationCount++;
                }
                break;
            case 9:
                this.yMap = this.speed;
                this.points += this.speed;
                if (this.animationCount >= SKIER_ANIMATION_COUNT) {
                  this.setStatus(SKIER_JUMP_5);
                  this.animationCount = 0;
                } else {
                  this.animationCount++;
                }
                break;
            case 10:
                this.yMap = this.speed;
                this.points += this.speed;
                this.setStatus(SKIER_DOWN);
                break;
            case 11:
                this.yMap = 0;
                this.xMap = 0;
                if (this.animationCount >= SKIER_ANIMATION_COUNT) {
                  this.setStatus(SKIER_RHINO_LIFT_MOUTH);
                  this.animationCount = 0;
                } else {
                  this.animationCount++;
                }
                break;
            case 12:
                this.yMap = 0;
                this.xMap = 0;
                if (this.animationCount >= SKIER_ANIMATION_COUNT) {
                  this.setStatus(SKIER_RHINO_EAT_1);
                  this.animationCount = 0;
                } else {
                  this.animationCount++;
                }
                break;
            case 13:
                this.yMap = 0;
                this.xMap = 0;
                if (this.animationCount >= SKIER_ANIMATION_COUNT) {
                  this.setStatus(SKIER_RHINO_EAT_2);
                  this.animationCount = 0;
                } else {
                  this.animationCount++;
                }
                break;
            case 14:
                this.yMap = 0;
                this.xMap = 0;
                if (this.animationCount >= SKIER_ANIMATION_COUNT) {
                  this.setStatus(SKIER_RHINO_EAT_3);
                  this.animationCount = 0;
                } else {
                  this.animationCount++;
                }
                break;
            case 15:
                this.yMap = 0;
                this.xMap = 0;
                if (this.animationCount >= SKIER_ANIMATION_COUNT) {
                  this.setStatus(SKIER_RHINO_EAT_4);
                  this.animationCount = 0;
                } else {
                  this.animationCount++;
                }
                break;
            case 16:
                //Display points eaten by rhino
                if (this.lives <= SKIER_DEAD && !this.eaten) {
                  alert('Score: ' + Math.round(this.points) + ' points!');
                  this.eaten = true;
                  window.open('https://www.youtube.com/watch?v=RfmWcJY4II4', '_blank');
                }
                break;
    }
  }

  toggleKonami() {
    this.konamiMode = !this.konamiMode;

    if (this.konamiMode)
    {
      this.speed = 3 * SKIER_SPEED;
    } else {
      this.speed = SKIER_SPEED;
    }
  }

  setStatus(newStatus) {
    if (newStatus < 0 || newStatus >= SKIER_STATUS_COUNT) {
      console.log("Error: Invalid status'" + newStatus + "' provided to Skier setStatus()");
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
        case 11:
            this.assetName = 'rhinoLift';
            break;
        case 12:
            this.assetName = 'rhinoLiftMouthOpen';
            break;
        case 13:
            this.assetName = 'rhinoLiftEat1';
            break;
        case 14:
            this.assetName = 'rhinoLiftEat2';
            break;
        case 15:
            this.assetName = 'rhinoLiftEat3';
            break;
        case 16:
            this.assetName = 'rhinoLiftEat4';
            break;
    }

    return true;
  }

  detectCollision (target) {
  if (typeof target == 'undefined' || !(typeof target.x !== 'undefined' && typeof target.y !== 'undefined' && typeof target.imageWidth !== 'undefined' && typeof target.imageHeight !== 'undefined'))
  {
    console.log('Error: Invalid argument provided to detectCollision for ' + this.assetName);
    return false;
  }

  if (!target.hittable)
    return false;

  if (this.konamiMode)  //Invincible
    return false;

  var itemRect = {
      left: this.x - this.imageWidth / 2,
      right: this.x + this.imageWidth / 2,
      top: this.y - this.imageHeight / 2,
      bottom: this.y + this.imageHeight / 2
  };

  var targetRect = {
      left: target.x - target.imageWidth / 2,
      right: target.x + target.imageWidth / 2,
      top: target.y - target.imageHeight / 2,
      bottom: target.y + target.imageHeight / 2
  };

  return !( (targetRect.left > itemRect.right ||
            targetRect.right < itemRect.left) ||
            (targetRect.top > itemRect.bottom ||
            targetRect.bottom < itemRect.top));
  }

  resetMap() {
    this.xMap = 0;
    this.yMap = 0;
  }
};
