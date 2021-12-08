const Games = require('./../../../engine/games.js');
const Point = require('./../../../engine/point.js');
const Direction = Games.require('./../direction.js');
const Element = Games.require('./../elements.js');
const { getTheBestPath } = require("./pathfinder");
const { getEnemyLeftDistance, getEnemyRightDistance,
  decreaseBulletCounter, setBulletCounter,
  digHoleIfNeeded } = require("./enemydefender");
const { GameConstants } = require("./gameconstants");

const bullets_array = [];

class MovementManager {    
    potion_time = 0;
    potion_taken = false;
    next_item = null;
    //board
    board = "";

    constructor(_board){
        this.board = _board;
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
            default:
                return Direction.STOP;
        }
    }

    getTheNextMove = () => {
        decreaseBulletCounter(bullets_array);

        this.deactivateItem();
        this.activateNextItem();

        const robbers_cached = this.board.getRobbers();

        let myPosition = this.board.getHero();

        let digHoleIfNeededResult = digHoleIfNeeded(this.board, myPosition, robbers_cached);
        if (digHoleIfNeededResult !== null) {
            return this.convertCustomToGameDirection(digHoleIfNeededResult);
        }

        let myBullet = bullets_array.find(bullet => bullet.y == myPosition.y && bullet.counter > 0);

        const enemyLeftDistance = getEnemyLeftDistance(this.board, myPosition);
        const enemyRightDistance = getEnemyRightDistance(this.board, myPosition);

        if (enemyLeftDistance > 0 && myBullet === undefined) {
            setBulletCounter(bullets_array, myPosition.y, enemyLeftDistance);
            return Direction.SHOOT_LEFT;
        }
        else if (enemyRightDistance > 0 && myBullet === undefined) {
            setBulletCounter(bullets_array, myPosition.y, enemyRightDistance);
            return Direction.SHOOT_RIGHT;
        }

        let neededPath = getTheBestPath(this.board, myPosition, this.potion_taken);
        if (neededPath === null) {
            return Direction.STOP;
        }

        let stringDirection = neededPath.directions[1];
        this.setNextItem(this.board, neededPath.points[1]);

        return this.convertCustomToGameDirection(stringDirection);
    }

    setNextItem = (nextPoint) => {
        if (this.board.isAt(nextPoint.x, nextPoint.y, Element.MASK_POTION)) {
            this.next_item = Element.MASK_POTION;
        }

        this.next_item = Element.NONE;
    }

    activateNextItem = () => {
        if (this.next_item === Element.MASK_POTION) {
            this.potion_taken = true;
            this.potion_time = mask_potion_duration;
        }
    }

    deactivateItem = () => {
        if (this.potion_time > 0) {
            this.potion_time--;
        } else {
            this.potion_time = 0;
            this.potion_taken = false;
        }
    }
}

module.exports.MovementManager = MovementManager;

