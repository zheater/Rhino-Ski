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
    this.hittable = true;
    this.imageWidth = 0;
    this.imageHeight = 0;
    this.moveable = true; //By default items WILL move within viewport
  }

  wasHit() {
    this.hittable = false;  //Obstacle can only be hit once.
  }
}
