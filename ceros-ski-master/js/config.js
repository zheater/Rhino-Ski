//Asset names with image paths
var assets = {
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

//Establish obstacle types
var obstacleTypes = [
    'tree',
    'treeCluster',
    'rock1',
    'rock2'
];


var DIFFICULTY = 10; //Inversely proportional at the moment...
var RANDMIN = 1;
var RANDMAX = 100;
var JUMP_PROBABILITY = 10;

//Skier default settings
SKIER_LIVES = 3;
SKIER_SPEED = 8;
SKIER_STATUS_COUNT = 11;
SKIER_CRASH = 0;
SKIER_LEFT = 1;
SKIER_LEFT_DOWN = 2;
SKIER_DOWN = 3;
SKIER_RIGHT_DOWN = 4;
SKIER_RIGHT = 5;
SKIER_JUMP_1 = 6;
SKIER_JUMP_2 = 7;
SKIER_JUMP_3 = 8;
SKIER_JUMP_4 = 9;
SKIER_JUMP_5 = 10;

//Establish client-specific game dimensions
var gameWidth = window.innerWidth;
var gameHeight = window.innerHeight;

//Instantiate Konami Array and checker Array
var keySequence = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
var konami = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65, 13];  //Up, Up, Down, Down, Left, Right, Left, Right, b, a, Enter
var konamiLength = konami.length;
