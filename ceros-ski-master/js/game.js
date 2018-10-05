//TODO add skier POINTS
//TODO fix rhino
//TODO stop hardcoding item image sizes
//TODO find a better rhino video
//TODO difficulty is broken
//TODO fix collision detection
//TODO Cleanup
//TODO deal with nested call bug (as is it's just commented out)
//TODO update rhino assets based on angle
//TODO add jumps
//TODO add skier jump capability
//TODO fix straight left and right
//TODO remove all TODOs
//TODO add any error checks I missed
$(document).ready(function() {
    var loadedAssets = {};    //Array for asset images
    var obstacles = [];       //Array for instantiated obstacles
    var skier = new Skier();  //Instantiate skier
    //TODO randomize instantiation of rhino
    var rhino = new Rhino();  //Instantiate tank puppy

	  //Configure drawable canvas
    var canvas = $('<canvas></canvas>')
        .attr('width', gameWidth * window.devicePixelRatio)
        .attr('height', gameHeight * window.devicePixelRatio)
        .css({
            width: gameWidth + 'px',
            height: gameHeight + 'px'
        });
    $('body').append(canvas);
//    $('body').append('POINTS: ' + skier.points); TODO Fix this
    var ctx = canvas[0].getContext('2d');

    var clearCanvas = function() {
        ctx.clearRect(0, 0, gameWidth, gameHeight);
    };

    var drawItem = function (item) {
      itemImage = loadedAssets[item.assetName];

      if (item.moveable) {
        x = item.x - skier.xMap;
        y = item.y - skier.yMap;
      } else {
        x = item.x;
        y = item.y;
      }

      if (itemImage != null) {
        item.imageWidth = itemImage.width;
        item.imageHeight = itemImage.height;
        ctx.drawImage(itemImage, x, y, item.imageWidth, item.imageHeight);
      } else {
        console.log("Error: Asset image of type '" + item.assetName + "' not found.");
      }
    }

    //TODO Keep this function. Just use randoms to generate an array of item objects
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

    //TODO this seems to be placing an obstacle based on the direction of the skier...
    //Either way, keep this function
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

    //TODO replace this function with instantiation of new objects
    //TODO replace this with placeObstacle and have the functino accept an item types
    var placeRandomObstacle = function(minX, maxX, minY, maxY) {
        if (JUMP_PROBABILITY >= _.random(0, RANDMAX))
        {
          obstacle = new Item('jumpRamp');
        } else {
          var obstacleIndex = _.random(0, obstacleTypes.length - 1);
          obstacle = new Item(obstacleTypes[obstacleIndex]);
        }
        var position = calculateOpenPosition(minX, maxX, minY, maxY);
        obstacle.x = position.x;
        obstacle.y = position.y;

        obstacles.push(obstacle);
    };

    //TODO this can sometimes cause a "maximum call stack size exceeded" error. debug
    var calculateOpenPosition = function(minX, maxX, minY, maxY) {
        var x = _.random(minX, maxX);
        var y = _.random(minY, maxY);

        var foundCollision = _.find(obstacles, function(obstacle) {
            return x > (obstacle.x - 50) && x < (obstacle.x + 50) && y > (obstacle.y - 50) && y < (obstacle.y + 50);
        });

//        if(foundCollision) {
//            return calculateOpenPosition(minX, maxX, minY, maxY);
//        }
//        else {
            return {
                x: x,
                y: y
//            }
        }
    };

    var gameLoop = function() {
        ctx.save();

        // Retina support
        ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

        clearCanvas();

        skier.move();
        rhino.moveToward(skier);

        if (skier.status === SKIER_LEFT_DOWN || skier.status === SKIER_DOWN || skier.status === SKIER_RIGHT_DOWN)
          placeNewObstacle(skier.status);

        //Draw elements
        drawItem(skier);
        drawItem(rhino);
        for (ii = 0; ii < obstacles.length - 1; ii++)
        {
          drawItem(obstacles[ii]);
          if (skier.detectCollision(obstacles[ii]))
            skier.setStatus(SKIER_CRASH);
        }

        scrubItems(obstacles[ii]);

        ctx.restore();
        requestAnimationFrame(gameLoop);
    };

    //TODO I think this function should remain unchanged
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
            switch(event.which) {
                case 37: // left
                    if(skier.status === SKIER_LEFT) {
                        skier.xMap -= skier.speed;
                        if (shouldPlaceObstacle())
                          placeNewObstacle(skier.status);
                    } else {
                        skier.setStatus(skier.status - 1);
                    }
                    event.preventDefault();
                    break;
                case 39: // right
                    if(skier.status === SKIER_RIGHT) {
                        skier.xMap += skier.speed;
                        if (shouldPlaceObstacle())
                          placeNewObstacle(skier.status);
                    } else {
                        skier.setStatus(skier.status + 1);
                    }
                    event.preventDefault();
                    break;
                case 38: // up
                    skier.yMap -= skier.speed;
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

    initGame(gameLoop);

    //Removes items outside of viewport from an array of items.
    var scrubItems = function (items) {
      var newObstacles = [];

      for (ii = 0; ii < items.length; ii++)
        if (items[ii].x >= 0 && items[ii].x <= gameWidth && items[ii].y >= 0 && items[ii].y <= gameHeight)  //Is item still within viewport?
          newObstacles.push(item[ii]);

      items = newObstacles;
    }

    //Randomizing obstacle placement based on DIFFICULTY
    var shouldPlaceObstacle = function() {
      var shouldPlace = _.random(RANDMIN, RANDMAX);
      if(shouldPlace > DIFFICULTY) {
          return false;
      } else {
        return true;
      }
    }

    //Checking key sequence against the Konami Sequence
    var checkKonami = function(key) {
      for (ii = 0; ii < konamiLength - 1; ii++)
        keySequence[ii] = keySequence[ii + 1];

      keySequence[konamiLength - 1] = event.which;

      var match = true; //TODO kind of a clunky implementation here
      for (ii = 0; ii < konamiLength; ii++)
      {
        if (!(keySequence[ii] === konami[ii]))
          match = false;
      }
      return match;
    }
});
