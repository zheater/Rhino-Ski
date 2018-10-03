$(document).ready(function() {
	//Setup assets
  /*  var assets = {
        'skierCrash' : 'img/skier_crash.png',
        'skierLeft' : 'img/skier_left.png',
        'skierLeftDown' : 'img/skier_left_down.png',
        'skierDown' : 'img/skier_down.png',
        'skierRightDown' : 'img/skier_right_down.png',
        'skierRight' : 'img/skier_right.png',
        'tree' : 'img/tree_1.png',
        'treeCluster' : 'img/tree_cluster.png',
        'rock1' : 'img/rock_1.png',
        'rock2' : 'img/rock_2.png'
    };*/
    var loadedAssets = {};

	//Establish obstacle types
    var obstacleTypes = [
        'tree',
        'treeCluster',
        'rock1',
        'rock2'
    ];
    var obstacles = [];

    var gameWidth = window.innerWidth;
    var gameHeight = window.innerHeight;
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

    var skier = new Skier();
    var rhino = new Rhino();

/*    var skierDirection = 5;
    var skierMapX = 0;
    var skierMapY = 0;
    var skierSpeed = 8;
*/

    var clearCanvas = function() {
        ctx.clearRect(0, 0, gameWidth, gameHeight);
    };

    skier.move()
/*    var moveSkier = function() {
        switch(skierDirection) {
            case 2:
                skierMapX -= Math.round(skierSpeed / 1.4142);	//TODO why is this rounded and case 4 isn't?
                skierMapY += Math.round(skierSpeed / 1.4142);

                placeNewObstacle(skierDirection);
                break;
            case 3:
                skierMapY += skierSpeed;

                placeNewObstacle(skierDirection);
                break;
            case 4:
                skierMapX += skierSpeed / 1.4142;
                skierMapY += skierSpeed / 1.4142;

                placeNewObstacle(skierDirection);
                break;
        }
    };*/

/*    var getSkierAsset = function() {
        var skierAssetName;
        switch(skierDirection) {
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
                break;
        }

        return skierAssetName;
    };*/

    var drawSkier = function() {
        var skierImage = loadedAssets[skier.getAssetName()];
        var x = (gameWidth - skier.imageWidth) / 2;
        var y = (gameHeight - skier.imageHeight) / 2;

        alert('SKIER - x: ' + x + '; y: ' + y + '; width: ' + skier.imageWidth + '; height: ' + skier.imageHeight);
        if (skierImage != null) {
          ctx.drawImage(skierImage, x, y, skier.imageWidth, skier.imageHeight);
        } else {
          console.log("Error: Image asset '" + skier.getAssetName() + "' not found.");
        }
    };

    var drawObstacles = function() {
        var newObstacles = [];

        _.each(obstacles, function(obstacle) {
            var obstacleImage = loadedAssets[obstacle.type];
            alert('OBSTACLE - x: ' + obstacle.x + '; y: ' + obstacle.y + '; width: ' + obstacleImage.width + '; height: ' + obstacleImage.height);
            var x = obstacle.x - skier.x - obstacleImage.width / 2;
            var y = obstacle.y - skier.y - obstacleImage.height / 2;

            if(x < -100 || x > gameWidth + 50 || y < -100 || y > gameHeight + 50) {
                return;
            }

            ctx.drawImage(obstacleImage, x, y, obstacleImage.width, obstacleImage.height);

            newObstacles.push(obstacle);
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
            var obstacleImage = loadedAssets[obstacle.type];
            return obstacle.y + obstacleImage.height;
        });
    };

    //TODO this seems to be placing an obstacle based on the direction of the skier...
    //Either way, keep this function
    var placeNewObstacle = function(direction) {
        var shouldPlaceObstacle = _.random(1, 8);
        if(shouldPlaceObstacle !== 8) {
            return;
        }

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

        obstacles.push({
            type : obstacleTypes[obstacleIndex],
            x : position.x,
            y : position.y
        })
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

    //TODO not sure exactly where this should live yet.
/*    var checkIfSkierHitObstacle = function() {
        var skierAssetName = skier.getAssetName();
        var skierImage = loadedAssets[skierAssetName];
        var skierRect = {
            left: skier.x + gameWidth / 2,
            right: skier.x + skier.imageWidth + gameWidth / 2,
            top: skier.y + skier.imageHeight - 5 + gameHeight / 2,
            bottom: skier.y + skier.imageHeight + gameHeight / 2
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
    };
*/

    //TODO not sure where this should live
/*    var intersectRect = function(r1, r2) {
        return !(r2.left > r1.right ||
            r2.right < r1.left ||
            r2.top > r1.bottom ||
            r2.bottom < r1.top);
    };
*/

    var gameLoop = function() {

        ctx.save();

        // Retina support
        ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

        clearCanvas();

        skier.move();

        skier.detectCollision();

        for(ii = 0; ii < obstacles.length - 1; ii++)
          drawSkier(obstacles[ii], gameWidth);

        //for(ii = 0; ii < obstacles.length - 1; ii++)
        //  obstacles[ii].draw();

        drawObstacles();

        ctx.restore();

        requestAnimationFrame(gameLoop);
    };

    //TODO I think this function should remain unchanged
    var loadAssets = function() {
        var assetPromises = [];

        _.each(assets, function(asset, assetName) {
          alert(asset);
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

    //Todo add Konami code mode
    var setupKeyhandler = function() {
        $(window).keydown(function(event) {
            switch(event.which) {
                case 37: // left
                    if(skier.status === 1) {
                        skier.x -= skier.speed
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
                        placeNewObstacle(6);
                    }
                    event.preventDefault();
                    break;
                case 40: // down
                    skierDirection = 3;
                    event.preventDefault();
                    break;
            }
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
