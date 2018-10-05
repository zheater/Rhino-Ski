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
    this.moveable = true; //By default items WILL move within viewport
  }

  detectCollision (target) {
    if (typeof target == 'undefined' || !(typeof target.x !== 'undefined' && typeof target.y !== 'undefined' && typeof target.imageWidth !== 'undefined' && typeof target.imageHeight !== 'undefined'))
    {
      console.log('Error: Invalid argument provided to detectCollision for ' + this.assetName);
      return false;
    }

    if (this.konamiMode)
      return false;

    var itemRect = {
        left: this.x - this.imageWidth / 2,
        right: this.x + this.imageWidth / 2,
        bottom: this.y - this.imageHeight / 2,
        top: this.y + this.imageHeight / 2
    };

    var targetRect = {
        left: target.x - target.imageWidth / 2,
        right: target.x + target.imageWidth / 2,
        top: target.y - target.imageHeight / 2,
        bottom: target.y + target.imageHeight / 2
    };


    return !( targetRect.left > itemRect.right ||
              targetRect.right < itemRect.left ||
              targetRect.top > itemRect.bottom ||
              targetRect.bottom < itemRect.top);
  }
}
