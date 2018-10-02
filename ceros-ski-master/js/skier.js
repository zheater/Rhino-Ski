class Skier extends Item {

  constructor() {
    super('skier');
    this.konamiMode = 0;
    this.points = 0;
    this.status = 5;
    this.speed = 8;
    this.x = 0;
    this.y = 0;
    this.imageWidth = 0;
    this.imageHeight = 0;
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

  draw () {
      var skierAssetName = getSkierAsset();
      var skierImage = loadedAssets[skierAssetName];
      var x = (gameWidth - this.imageWidth) / 2;
      var y = (gameHeight - this.imageHeight) / 2;

      ctx.drawImage(skierImage, x, y, this.imageWidth, this.imageHeight);
  }

  move () {
    switch(this.status) {
        case 2:
            this.x -= Math.round(skierSpeed / 1.4142);	//TODO why is this rounded and case 4 isn't?
            this.y += Math.round(skierSpeed / 1.4142);

            placeNewObstacle(skierDirection);
            break;
        case 3:
            this.y += skierSpeed;

            placeNewObstacle(skierDirection);
            break;
        case 4:
            this.x += skierSpeed / 1.4142;
            this.y += skierSpeed / 1.4142;

            placeNewObstacle(skierDirection);
            break;
    }
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
