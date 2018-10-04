$(document).ready(function() {
    var loadedAssets = {};    //Array for asset images
    var obstacles = [];       //Array for instantiated obstacles
    var skier = new Skier();  //Instantiate skier
    var rhino = new Rhino();  //Instantiate rhino

	  //Configure drawable canvas
    var canvas = $('<canvas></canvas>')
        .attr('width', gameWidth * window.devicePixelRatio)
        .attr('height', gameHeight * window.devicePixelRatio)
        .css({
            width: gameWidth + 'px',
            height: gameHeight + 'px'
        });
    $('body').append(canvas);
    $('body').append('POINTS: ' + skier.points);
    var ctx = canvas[0].getContext('2d');

    var clearCanvas = function() {
        ctx.clearRect(0, 0, gameWidth, gameHeight);
    };

    skier.move(); //TODO does this need to be here?

    var drawSkier = function() {
        var skierImage = loadedAssets[skier.getAssetName()];

        //Skier stays pegged in the center.
        var x = (gameWidth - skier.imageWidth) / 2;
        var y = (gameHeight - skier.imageHeight) / 2;

        skier.imageWidth = skierImage.width;
        skier.imageHeight = skierImage.height;

        //alert('SKIER - x: ' + x + '; y: ' + y + '; width: ' + skier.imageWidth + '; height: ' + skier.imageHeight);
        if (skierImage != null) {
          ctx.drawImage(skierImage, x, y, skier.imageWidth, skier.imageHeight);
        } else {
          console.log("Error: Asset image of type '" + skier.getAssetName() + "' not found.");
        }
    };


    var drawObstacles = function() {
            var newObstacles = [];

            _.each(obstacles, function(obstacle) {

                var obstacleImage = loadedAssets[obstacle.assetName];
                if (typeof obstacleImage == 'undefined') {
                  console.log("Error: Asset image of type '" + obstacle.assetName + "' not found.");
                } else {
                  obstacle.width = obstacleImage.width;
                  obstacle.height = obstacleImage.height;

                  var x = obstacle.x - skier.x - obstacle.width / 2;
                  var y = obstacle.y - skier.y - obstacle.height / 2;

                  if(x < -100 || x > gameWidth + 50 || y < -100 || y > gameHeight + 50) { //Checking for out of viewport obstacles to be removed from obstacles array
                      return;
                  }

                  ctx.drawImage(obstacleImage, x, y, obstacle.width, obstacle.height);

                  newObstacles.push(obstacle);
                }
            });

            obstacles = newObstacles;
        };

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
        var leftEdge = skier.x;
        var rightEdge = skier.x + gameWidth;
        var topEdge = skier.y;
        var bottomEdge = skier.y + gameHeight;

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
    var placeRandomObstacle = function(minX, maxX, minY, maxY) {
        var obstacleIndex = _.random(0, obstacleTypes.length - 1);

        var position = calculateOpenPosition(minX, maxX, minY, maxY);

        obstacle = new Item(obstacleTypes[obstacleIndex]);
        obstacle.x = position.x;
        obstacle.y = position.y;

        obstacles.push(obstacle);
    };

    //This stays here
    var calculateOpenPosition = function(minX, maxX, minY, maxY) {
        var x = _.random(minX, maxX);
        var y = _.random(minY, maxY);

        var foundCollision = _.find(obstacles, function(obstacle) {
            return x > (obstacle.x - 50) && x < (obstacle.x + 50) && y > (obstacle.y - 50) && y < (obstacle.y + 50);
        });

        if(foundCollision) {
            return calculateOpenPosition(minX, maxX, minY, maxY);
        }
        else {
            return {
                x: x,
                y: y
            }
        }
    };

    var gameLoop = function() {

        ctx.save();

        // Retina support
        ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

        clearCanvas();

        skier.move();
        if (skier.status === 2 || skier.status === 3 || skier.status === 4)
          placeNewObstacle(skier.status);

//        skier.detectCollision();

//        for(ii = 0; ii < obstacles.length - 1; ii++)
//          drawSkier(obstacles[ii], gameWidth);
          drawSkier();

          //TODO Should I unify the draw functions?
          //i.e.:
          //draw(skier);
          //
          //foreach obstacles
          //draw(obstacle);
          //
          //draw(rhino);

//        for(ii = 0; ii < obstacles.length - 1; ii++)
//          drawObstacle(obstacles[ii]);

        drawObstacles();


        ctx.restore();

        requestAnimationFrame(gameLoop);
    };

    //TODO I think this function should remain unchanged
    var loadAssets = function() {
        var assetPromises = [];

        _.each(assets, function(asset, assetName) {
//          alert(asset);
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

    var shouldPlaceObstacle = function() {
      var shouldPlace = _.random(RANDMIN, RANDMAX);
      if(shouldPlace > DIFFICULTY) {
          return false;
      } else {
        return true;
      }
    }

    //TODO add Konami code mode
    var setupKeyhandler = function() {
        $(window).keydown(function(event) {
            switch(event.which) {
                case 37: // left            //TODO Define these parameters above. Or, better yet, in a config.js file along with the asset names
                    if(skier.status === 1) {
                        skier.x -= skier.speed
                        if (shouldPlaceObstacle())
                          placeNewObstacle(skier.status);
                    }
                    else {
                        skier.status--;
                    }
                    event.preventDefault();
                    break;
                case 39: // right
                    if(skier.status === 5) {
                        skier.x += skier.speed;
                        if (shouldPlaceObstacle())
                          placeNewObstacle(skier.status);
                    }
                    else {
                        skier.status++;
                    }
                    event.preventDefault();
                    break;
                case 38: // up
                    if(skier.status === 1 || skier.status === 5) {
                        skier.y -= skier.speed;
                        if (shouldPlaceObstacle())
                          placeNewObstacle(6);
                    }
                    event.preventDefault();
                    break;
                case 40: // down
                    skierDirection = 3;
                    event.preventDefault();
                    break;
            }

            //TODO move this stuff to a seperate function?
            for (ii = 0; ii < konamiLength - 1; ii++)
            {
              keySequence[ii] = keySequence[ii + 1];
            }

            keySequence[konamiLength - 1] = event.which;

            var match = true; //TODO kind of a clunky implementation here
            for (ii = 0; ii < konamiLength; ii++)
            {
              if (!(keySequence[ii] === konami[ii]))
                match = false;
            }
            if (match)
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
});
