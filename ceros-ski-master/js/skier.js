class Skier extends Item {

  constructor() {
    super('skierRight');
    this.konamiMode = 0;
    this.points = 0;
    this.status = 5;
    this.speed = 8;
    this.lives = 3;
  }

  getAssetName () {
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
            xDelta = (-1) * Math.round(skierSpeed / 1.4142);	//TODO why is this rounded and case 4 isn't?
            yDelta = Math.round(skierSpeed / 1.4142);

            placeNewObstacle(skierDirection);
            break;
        case 3:
            yDelta += skierSpeed;

            placeNewObstacle(skierDirection);
            break;
        case 4:
            xDelta = skierSpeed / 1.4142;
            yDelta = skierSpeed / 1.4142;

            placeNewObstacle(skierDirection);
            break;
    }
    this.x += xDelta;
    this.y += yDelta;
    this.points += yDelta;
  }

  hitObstacle () {
    if (this.konamiMode)
      return false;

    var skierAssetName = getSkierAsset();
    var skierImage = loadedAssets[skierAssetName];
    var skierRect = {
        left: skierMapX + gameWidth / 2,
        right: skierMapX + this.imageWidth + gameWidth / 2,
        top: skierMapY + this.imageHeight - 5 + gameHeight / 2,
        bottom: skierMapY + this.imageHeight + gameHeight / 2
    };

    var collision = _.find(obstacles, function(obstacle) {
        var obstacleImage = loadedAssets[obstacle.type];
        var obstacleRect = {
            left: obstacle.x,
            right: obstacle.x + obstacleImage.width,
            top: obstacle.y + obstacleImage.height - 5,
            bottom: obstacle.y + obstacleImage.height
        };

        return intersectRect(skierRect, obstacleRect);
    });

    if(collision) {
        skierDirection = 0;
    }
  }
};
