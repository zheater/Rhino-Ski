class Item {
  constructor(asset) {
    if (assets.hasOwnProperty(asset)) {
        this.assetName = asset;
    } else {
      console.log('Error: Invalid asset provided to Item constructor. Default tree assigned.');
      this.assetName = 'tree';
    }

    this.x = 0;
    this.y = 0;
    this.imageWidth = 27;
    this.imageHeight = 23;
  }

  detectCollision (target, gameWidth) {
    if (typeof target == 'undefined' || !(typeof target.x !== 'undefined' && typeof target.y !== 'undefined' && typeof target.imageWidth !== 'undefined' && typeof target.imageHeight !== 'undefined'))
    {
      console.log('Error: Invalid argument provided to detectCollision for ' + this.assetName);
      return false;
    }

    var itemRect = {
        left: this.x + gameWidth / 2,
        right: this.x + this.imageWidth + gameWidth / 2,
        top: this.y + this.imageHeight - 5 + gameHeight / 2, //TODO what's with the 5? hard code
        bottom: this.y + this.imageHeight + gameHeight / 2
    };

    var obstacleRect = {
        left: target.x,
        right: target.x + target.imageWidth,
        top: target.y + target.imageHeight - 5, //TODO what's with the 5? hard code
        bottom: tartget.y + target.imageHeight
    };

    return !( obstacleRect.left > itemRect.right ||
              obstacleRect.right < itemRect.left ||
              obstacleRect.top > itemRect.bottom ||
              obstacleRect.bottom < itemRect.top);

  }

  if(collision) {
      skierDirection = 0; //TODO what's this??
  }
}
