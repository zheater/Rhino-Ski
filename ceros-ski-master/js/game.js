$(document).ready(function() {
    var loadedAssets = {};    //Array for asset images
    var obstacles = [];       //Array for instantiated obstacles
    var skier = new Skier();  //Instantiate skier
    var rhino = new Rhino();  //Instantiate take puppy

	  //Configure drawable canvas
    var canvas = $('<canvas></canvas>')
        .attr('width', gameWidth * window.devicePixelRatio)
        .attr('height', gameHeight * window.devicePixelRatio)
        .css({
            width: gameWidth + 'px',
            height: gameHeight + 'px'
        });
    $('body').append(canvas);
    var ctx = canvas[0].getContext('2d');

    var clearCanvas = function() {
        ctx.clearRect(0, 0, gameWidth, gameHeight);
    };

    var drawItem = function (item, mapItem) {
      itemImage = loadedAssets[item.assetName];

      if (item.moveable) {
        if (typeof mapItem === 'undefined') {
          console.log('Error: mapItem not provided to drawItem()');
          return;
        }
        item.x -= mapItem.xMap;
        item.y -= mapItem.yMap;
      }

      if (itemImage != null) {
        item.imageWidth = itemImage.width;
        item.imageHeight = itemImage.height;
        ctx.drawImage(itemImage, item.x, item.y, item.imageWidth, item.imageHeight);
      } else {
        console.log("Error: Asset image of type '" + item.assetName + "' not found.");
      }
    }

    //Removes items outside of viewport from an array of items.
    var scrubItems = function (items) {
      var newObstacles = [];

      for (ii = 0; ii < items.length; ii++)
        if (items[ii].x >= 0 && items[ii].x <= gameWidth && items[ii].y >= 0 && items[ii].y <= gameHeight)  //Is item still within viewport?
          newObstacles.push(items[ii]);

      items = newObstacles;
    }

    //Randomizing obstacle placement based on DIFFICULTY
    var shouldPlaceObstacle = function() {
      var shouldPlace = _.random(RANDMIN, RANDMAX);
      if(shouldPlace < DIFFICULTY) {
        return true;
      } else {
        return false;
      }
    }

    //Checking key sequence against the Konami Sequence
    var checkKonami = function(key) {
      for (ii = 0; ii < konamiLength - 1; ii++)
        keySequence[ii] = keySequence[ii + 1];  //Shift characters in array one spot to the left

      keySequence[konamiLength - 1] = event.which;  //Tack new character onto the end

      var match = true;
      for (ii = 0; ii < konamiLength; ii++)
      {
        if (!(keySequence[ii] === konami[ii]))
          match = false;
      }
      return match;
    }

    var placeInitialObstacles = function() {
        var numberObstacles = Math.ceil(_.random(5, 7) * (gameWidth / 800) * (gameHeight / 500));

        var minX = -50;
        var maxX = gameWidth + 50;
        var minY = gameHeight / 2 + 100;
        var maxY = gameHeight + 50;

        for(var i = 0; i < numberObstacles; i++) {
            placeRandomObstacle(minX, maxX, minY, maxY);
        }

        obstacles = _.sortBy(obstacles, function(obstacle) {
            var obstacleImage = loadedAssets[obstacle.assetName];
            return obstacle.y + obstacle.height;
        });
    };

    var placeNewObstacle = function(direction) {
        var leftEdge = skier.xMap;
        var rightEdge = skier.xMap + gameWidth;
        var topEdge = skier.yMap;
        var bottomEdge = skier.yMap + gameHeight;

        switch(direction) {
            case 1: // left
                placeRandomObstacle(leftEdge - 50, leftEdge, topEdge, bottomEdge);
                break;
            case 2: // left down
                placeRandomObstacle(leftEdge - 50, leftEdge, topEdge, bottomEdge);
                placeRandomObstacle(leftEdge, rightEdge, bottomEdge, bottomEdge + 50);
                break;
            case 3: // down
                placeRandomObstacle(leftEdge, rightEdge, bottomEdge, bottomEdge + 50);
                break;
            case 4: // right down
                placeRandomObstacle(rightEdge, rightEdge + 50, topEdge, bottomEdge);
                placeRandomObstacle(leftEdge, rightEdge, bottomEdge, bottomEdge + 50);
                break;
            case 5: // right
                placeRandomObstacle(rightEdge, rightEdge + 50, topEdge, bottomEdge);
                break;
            case 6: // up
                placeRandomObstacle(leftEdge, rightEdge, topEdge - 50, topEdge);
                break;
        }
    };

    var placeRandomObstacle = function(minX, maxX, minY, maxY) {
        if (JUMP_PROBABILITY >= _.random(0, RANDMAX))
        {
          obstacle = new Item('jumpRamp');
        } else {
          var obstacleIndex = _.random(0, obstacleTypes.length - 1);
          obstacle = new Item(obstacleTypes[obstacleIndex]);
        }

        var position = {x: _.random(minX, maxX), y: _.random(minY, maxY)};
        obstacle.x = position.x;
        obstacle.y = position.y;

        obstacles.push(obstacle);
    };

    var loadAssets = function() {
        var assetPromises = [];

        _.each(assets, function(asset, assetName) {
            var assetImage = new Image();
            var assetDeferred = new $.Deferred();

            assetImage.onload = function() {
                assetImage.width /= 2;
                assetImage.height /= 2;

                loadedAssets[assetName] = assetImage;
                assetDeferred.resolve();
            };
            assetImage.src = asset;
            assetPromises.push(assetDeferred.promise());
        });
        return $.when.apply($, assetPromises);
    };

    var setupKeyhandler = function() {
        $(window).keydown(function(event) {
          if (!(skier.status >= SKIER_JUMP_1 && skier.status <= SKIER_JUMP_5) && skier.lives > SKIER_DEAD) { //Don't change status if skier is jumping or dead
            switch(event.which) {
                case 37: // left
                    if(skier.status === SKIER_LEFT) {
                        skier.xMap = (-1) * skier.speed;
                        if (shouldPlaceObstacle())
                          placeNewObstacle(skier.status);
                    } else {
                        skier.setStatus(skier.status - 1);
                    }
                    event.preventDefault();
                    break;
                case 39: // right
                    if(skier.status === SKIER_RIGHT) {
                        skier.xMap = skier.speed;
                        if (shouldPlaceObstacle())
                          placeNewObstacle(skier.status);
                    } else {
                        skier.setStatus(skier.status + 1);
                    }
                    event.preventDefault();
                    break;
                case 38: // up
                    skier.yMap = (-1) * skier.speed;
                    skier.setStatus(SKIER_RIGHT);
                    if(skier.status === SKIER_LEFT || skier.status === SKIER_RIGHT) {
                        if (shouldPlaceObstacle())
                          placeNewObstacle(6);
                    }
                    event.preventDefault();
                    break;
                case 40: // down
                    skier.setStatus(SKIER_DOWN);
                    event.preventDefault();
                    break;
            }
          }

          if (checkKonami(event.which))
            skier.toggleKonami();
        });
    };

    var initGame = function() {
        setupKeyhandler();
        loadAssets().then(function() {
            placeInitialObstacles();
            requestAnimationFrame(gameLoop);
        });
    };

    var gameLoop = function() {
        ctx.save();

        // Retina support
        ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

        clearCanvas();

        if ((RHINO_PROBABILITY >= _.random(0, RANDMAX)) && rhino.status === RHINO_SLEEPING && skier.points >= RHINO_POINT_THD)
          rhino.status = RHINO_RIGHT; //Activate tank puppy

        skier.move();
        if (rhino.status !== RHINO_SLEEPING && rhino.status !== RHINO_EATING)
          rhino.moveToward(skier);

        if ((skier.status === SKIER_LEFT_DOWN || skier.status === SKIER_DOWN || skier.status === SKIER_RIGHT_DOWN) && shouldPlaceObstacle())
          placeNewObstacle(skier.status);

        //Draw elements
        drawItem(skier);
        if (rhino.status !== RHINO_SLEEPING && rhino.status !== RHINO_EATING)
          drawItem(rhino, skier);

        //Check for collisions
        for (ii = 0; ii < obstacles.length; ii++)
        {
          drawItem(obstacles[ii], skier);
          if (skier.detectCollision(obstacles[ii]) && (skier.status < SKIER_JUMP_1 || skier.status > SKIER_JUMP_5)) {  //Can't hit a tree while you're jumping
            if (obstacles[ii].assetName === 'jumpRamp')
              skier.setStatus(SKIER_JUMP_1);
            else {
              if (skier.status !== SKIER_CRASH) {
                skier.lives--;
                //Display points if dead
                if (skier.lives <= SKIER_DEAD)
                  alert('Score: ' + Math.round(skier.points) + ' points!');
              }
              obstacles[ii].wasHit();
              skier.setStatus(SKIER_CRASH);
            }
          }
        }

        if (rhino.status !== RHINO_SLEEPING && rhino.status !== RHINO_EATING)
          if (skier.detectCollision(rhino)) {
            skier.setStatus(SKIER_RHINO_LIFT);
            rhino.status = RHINO_EATING;
            skier.lives = 0;  //Rhinos don't give second chances
          }

        //Remove out of viewport obstacles
        scrubItems(obstacles);
        //Reset skier map
        skier.resetMap();
        skier.updateSpeed();

        ctx.restore();
        requestAnimationFrame(gameLoop);
    };

    initGame(gameLoop);
});
