const Games = require('./../../../engine/games.js');
const Point = require('./../../../engine/point.js');
const Direction = Games.require('./../direction.js');
const Element = Games.require('./../elements.js');
const { getTheBestPath, getRandomMovement } = require("./pathfinder");
const { getEnemyLeftShot, getEnemyRightShot, getEnemyUpShot, getEnemyDownShot, getFallingDownEnemyShot,
    decreaseBulletCounter, setBulletCounter, detectBullet,
    digHoleIfNeeded } = require("./enemydefender");
const { GameConstants } = require("./gameconstants");

let hotizontal_bullets_array = [];
let vertical_bullets_array = [];
let glow_increment = 0;
let ring_increment = 0;
let knife_increment = 0;
let next_item = null;
let potion_taken = false;
let potion_time = 0;
let shot_number = 0;

let walls = [];
let bricks = [];
let enemies = [];
let fallingEnemies = [];

class MovementManager {
    //board
    board = "";

    constructor(_board) {
        this.board = _board;

        if (this.board.hasHeroDied()) {
            console.log("Hero died");
            this.resetValues();
        }

        walls = this.board.getNonRuinableWalls();
        bricks = this.board.getRuinableWalls();
        enemies = this.board.getEnemies();
        fallingEnemies = this.board.getFallingEnemies();

        GameConstants.increment_for_glow_clue_price = glow_increment;
        GameConstants.increment_for_knife_clue_price = knife_increment;
        GameConstants.increment_for_ring_clue_price = ring_increment;

        console.log("glow", GameConstants.increment_for_glow_clue_price);
        console.log("knife", GameConstants.increment_for_knife_clue_price);
        console.log("ring", GameConstants.increment_for_ring_clue_price);
    }

    resetValues = () => {
        glow_increment = 0;
        ring_increment = 0;
        knife_increment = 0;
        next_item = null;
        potion_taken = false;
        potion_time = 0;
    }

    convertCustomToGameDirection = (stringDirection) => {
        switch (stringDirection) {
            case GameConstants.left_direction:
                return Direction.LEFT;
            case GameConstants.right_direction:
                return Direction.RIGHT;
            case GameConstants.up_direction:
                return Direction.UP;
            case GameConstants.down_direction:
                return Direction.DOWN;
            case GameConstants.shoot_left_down_direction:
                return Direction.CRACK_LEFT;
            case GameConstants.shoot_right_down_direction:
                return Direction.CRACK_RIGHT;
            case GameConstants.shoot_left_direction:
                return Direction.SHOOT_LEFT;
            case GameConstants.shoot_right_direction:
                return Direction.SHOOT_RIGHT;
            default:
                return Direction.STOP;
        }
    }

    getTheNextMove = () => {
        decreaseBulletCounter(hotizontal_bullets_array);
        decreaseBulletCounter(vertical_bullets_array);

        this.deactivateItem();
        this.activateNextItem();

        const robbers_cached = this.board.getRobbers();

        let myPosition = this.board.getHero();

        let shootEnemyDirection = this.shoot_enemy(myPosition);
        if (shootEnemyDirection !== null) {
            return shootEnemyDirection;
        }
        else {
            shot_number = 0;
        }

        let digHoleIfNeededResult = digHoleIfNeeded(this.board, myPosition, robbers_cached);
        if (digHoleIfNeededResult !== null) {
            return this.convertCustomToGameDirection(digHoleIfNeededResult);
        }

        let neededPath = getTheBestPath(this.board, myPosition, potion_taken);
        if (!neededPath) {
            let randomMovement = this.convertCustomToGameDirection(getRandomMovement(this.board, myPosition));
            return randomMovement;
        }

        let stringDirection = neededPath.directions[1];
        this.setNextItem(neededPath.points[1]);

        //return Direction.SHOOT_TWO_TIMES;
        //return Direction.SHOOT_UP;
        return this.convertCustomToGameDirection(stringDirection);
    }

    // hideFromBullet = () => {
    //     let myPosition = this.board.getHero();
    //     const bulletDetectedDirection = detectBullet(this.board, myPosition, hotizontal_bullets_array, vertical_bullets_array);

    //     switch(bulletDetectedDirection){
    //         case GameConstants.left_direction:

    //     }
    // }

    shoot_enemy = (myPosition) => {
        let myHorizontalBullet = hotizontal_bullets_array.find(bullet => bullet.coordinate == myPosition.y);
        let myVerticalBullet = vertical_bullets_array.find(bullet => bullet.coordinate == myPosition.x);

        const enemyLeftShot = getEnemyLeftShot(this.board, myPosition, walls, bricks, enemies);
        const enemyRightShot = getEnemyRightShot(this.board, myPosition, walls, bricks, enemies);
        const enemyUpShot = getEnemyUpShot(this.board, myPosition, walls, bricks, enemies);
        const enemyDownShot = getEnemyDownShot(this.board, myPosition, walls, bricks, enemies);
        const fallingDownEnemyShot = getFallingDownEnemyShot(this.board, myPosition, fallingEnemies);

        shot_number++;

        if (enemyLeftShot && (myHorizontalBullet === undefined || myHorizontalBullet.counter == 0 && myHorizontalBullet.shotsTotalCount != myHorizontalBullet.shotsCount)) {
            setBulletCounter(hotizontal_bullets_array, myPosition.y, enemyLeftShot, shot_number);
            return Direction.SHOOT_LEFT;
        }
        else if (enemyRightShot && (myHorizontalBullet === undefined || myHorizontalBullet.counter == 0 && myHorizontalBullet.shotsTotalCount != myHorizontalBullet.shotsCount)) {
            setBulletCounter(hotizontal_bullets_array, myPosition.y, enemyRightShot, shot_number);
            return Direction.SHOOT_RIGHT;
        }
        else if (enemyUpShot && (myVerticalBullet === undefined || myVerticalBullet.counter == 0 && myVerticalBullet.shotsTotalCount != myVerticalBullet.shotsCount)) {
            setBulletCounter(vertical_bullets_array, myPosition.x, enemyUpShot, shot_number);
            return Direction.SHOOT_UP;
        }
        else if (enemyDownShot && (myVerticalBullet === undefined || myVerticalBullet.counter == 0 && myVerticalBullet.shotsTotalCount != myVerticalBullet.shotsCount)) {
            setBulletCounter(vertical_bullets_array, myPosition.x, enemyDownShot, shot_number);
            return Direction.SHOOT_DOWN;
        } else if (fallingDownEnemyShot && (myHorizontalBullet === undefined || myHorizontalBullet.counter == 0 && myHorizontalBullet.shotsTotalCount != myHorizontalBullet.shotsCount)) {
            setBulletCounter(hotizontal_bullets_array, myPosition.y, fallingDownEnemyShot.shot, shot_number);
            return this.convertCustomToGameDirection(fallingDownEnemyShot.shootDirection);
        }

        return null;
    }

    setNextItem = (nextPoint) => {
        if (this.board.isAt(nextPoint.x, nextPoint.y, Element.MASK_POTION)) {
            next_item = Element.MASK_POTION;
        }

        if (this.board.isAt(nextPoint.x, nextPoint.y, Element.CLUE_GLOVE)) {
            next_item = Element.CLUE_GLOVE;
            console.log("next item glove");
        }

        if (this.board.isAt(nextPoint.x, nextPoint.y, Element.CLUE_KNIFE)) {
            next_item = Element.CLUE_KNIFE;
            console.log("next item knife");
        }

        if (this.board.isAt(nextPoint.x, nextPoint.y, Element.CLUE_RING)) {
            next_item = Element.CLUE_RING;
            console.log("next item ring");
        }

        //next_item = Element.NONE;
    }

    activateNextItem = () => {
        switch (next_item) {
            case Element.MASK_POTION:
                potion_taken = true;
                potion_time = GameConstants.mask_potion_duration;
                break;

            case Element.CLUE_GLOVE:
                //console.log("glow taken");
                glow_increment++;
                break;
            case Element.CLUE_KNIFE:
                //console.log("knife taken");
                knife_increment++;
                break;
            case Element.CLUE_RING:
                //console.log("ring taken");
                ring_increment++;
                break;
        }

        next_item = null;
    }

    deactivateItem = () => {
        if (potion_time > 0) {
            potion_time--;
        } else {
            potion_time = 0;
            potion_taken = false;
        }
    }
}

const clearBulletsArray = () => {
    hotizontal_bullets_array = [];
    vertical_bullets_array = [];
}


module.exports = { MovementManager, clearBulletsArray };

