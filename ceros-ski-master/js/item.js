class Item {
  constructor(asset) {
    if (asset === 'tree' || asset === 'treeCluster' || asset === 'rock1' || asset === 'rock2' || asset === 'skier'  || asset === 'rhino' ) { //TODO switch this to global array
        this.assetName = asset;
    } else {
      console.log('Error: Invalid asset provided to Item constructor. Default tree assigned');
      this.assetName = 'tree';
    }

    this.x = 0;
    this.y = 0;
    this.width = 0;
    this.height = 0;
  }

  draw () {
    if(this.x < -100 || this.x > gameWidth + 50 || this.y < -100 || y > this.gameHeight + 50) { //TODO establish game parameters as globals
        return;
    }
    obstacleImage = //TODO get image from master global image key
    ctx.drawImage(obstacleImage, x, y, obstacleImage.width, obstacleImage.height);
  }
}
