var assets = {  //TODO figure out how to move this to game. Violates encapsulation here.
      'skierCrash' : 'img/skier_crash.png',
      'skierLeft' : 'img/skier_left.png',
      'skierLeftDown' : 'img/skier_left_down.png',
      'skierDown' : 'img/skier_down.png',
      'skierRightDown' : 'img/skier_right_down.png',
      'skierRight' : 'img/skier_right.png',
      'skierJump1' : 'img/skier_jump_1.png',
      'skierJump2' : 'img/skier_jump_2.png',
      'skierJump3' : 'img/skier_jump_3.png',
      'skierJump4' : 'img/skier_jump_4.png',
      'skierJump5' : 'img/skier_jump_5.png',
      'tree' : 'img/tree_1.png',
      'treeCluster' : 'img/tree_cluster.png',
      'rock1' : 'img/rock_1.png',
      'rock2' : 'img/rock_2.png',
      'rhino' : 'img/rhino_default.png',
      'rhinoLift' : 'img/rhino_lift.png',
      'rhinoLiftMouthOpen' : 'img/rhino_lift_mouth_open.png',
      'rhinoLiftEat1' : 'img/rhino_lift_eat_1.png',
      'rhinoLiftEat2' : 'img/rhino_lift_eat_2.png',
      'rhinoLiftEat3' : 'img/rhino_lift_eat_3.png',
      'rhinoLiftEat4' : 'img/rhino_lift_eat_4.png',
      'rhinoRunLeft' : 'img/rhino_run_left.png',
      'rhinoRunLeft2' : 'img/rhino_run_left_2.png',
      'rhinoRunRight' : 'img/rhino_run_right.png',
      'rhinoRunRight2' : 'img/rhino_run_right_2.png',
      'jumpRamp' : 'img/jump_ramp.png',
  };

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
    this.imageWidth = 0;
    this.imageHeight = 0;
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
