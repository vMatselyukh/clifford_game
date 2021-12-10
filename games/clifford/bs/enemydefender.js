const Element = require("../elements.js");
const Direction = require("../direction.js");
const { Shot } = require("./shot"); 
const Point = require("./../../../engine/point.js");
const { GameConstants } = require("./gameconstants.js");

const crack_left = "sleftdown";
const crack_right = "srightdown";

const getFallingDownEnemyShot = (board, myPosition, fallingEnemies) => {
    
    let isEnemyFallingToTheLine = true;
    let shootDirection = null;

    for(let i = 0; i < fallingEnemies.length; i++){
        isEnemyFallingToTheLine = true;
        if(fallingEnemies[i].y > myPosition.y){
            for(let j = fallingEnemies[i].y - 1; j > myPosition.y; j--)
            {
                if(!(board.isAt(fallingEnemies[i].x, j, Element.NONE)
                    || board.isAt(fallingEnemies[i].x, j, Element.PIPE)
                ))
                {
                    isEnemyFallingToTheLine = false;
                    break;
                }
            }

            if(fallingEnemies[i].x > myPosition.x){
                shootDirection = GameConstants.shoot_right_direction;
                for(let k = fallingEnemies[i].x; k > myPosition.x; k--){
                    if(board.isAt(k, myPosition.y, Element.BRICK)
                        || board.isAt(k, myPosition.y, Element.STONE))
                    {
                        isEnemyFallingToTheLine = false;
                    }
                }
            } else {
                shootDirection = GameConstants.shoot_right_direction;
                for(let k = fallingEnemies[i].x; k < myPosition.x; k++){
                    if(board.isAt(k, myPosition.y, Element.BRICK)
                        || board.isAt(k, myPosition.y, Element.STONE))
                    {
                        isEnemyFallingToTheLine = false;
                    }
                }
            }

            
            const distance = Math.abs(fallingEnemies[i].x - myPosition.x);
            const height = fallingEnemies[i].y - myPosition.y;

            if(height * 2 > distance){
                return;
            }

            return {shootDirection: shootDirection, shot: new Shot(distance, 1)};
        }
    }
}

const getEnemyLeftShot = (board, myPosition, walls, bricks, enemies) => {
    let x = myPosition.x;
    let bricksToEnemyCount = 0;
    while (!board.contains(walls, new Point(x, myPosition.y))) {
        x--;
        if(board.contains(bricks, new Point(x, myPosition.y)))
        {
            bricksToEnemyCount ++;
        }

        if (board.contains(enemies, new Point(x, myPosition.y))) {
            return new Shot(Math.abs(myPosition.x - x), bricksToEnemyCount + 1);
        }
    }

    return null;
}

const getEnemyRightShot = (board, myPosition, walls, bricks, enemies) => {
    let x = myPosition.x;
    let bricksToEnemyCount = 0;
    while (!board.contains(walls, new Point(x, myPosition.y))) {
        x++;
        if(board.contains(bricks, new Point(x, myPosition.y)))
        {
            bricksToEnemyCount ++;
        }

        if (board.contains(enemies, new Point(x, myPosition.y))) {
            return new Shot(Math.abs(myPosition.x - x), bricksToEnemyCount + 1);
        }
    }

    return null;
}

const getEnemyUpShot = (board, myPosition, walls, bricks, enemies) => {
    if(!board.isAt(myPosition.x, myPosition.y, Element.HERO_LADDER))
    {
        return null;
    }

    let y = myPosition.y;
    let bricksToEnemyCount = 0;
    while (!board.contains(walls, new Point(myPosition.x, y))) {
        y++;
        if(board.contains(bricks, new Point(myPosition.x, y)))
        {
            bricksToEnemyCount ++;
        }

        if (board.contains(enemies, new Point(myPosition.x, y))) {
            return new Shot(Math.abs(myPosition.y - y), bricksToEnemyCount + 1);
        }
    }

    return null;
}

const getEnemyDownShot = (board, myPosition, walls, bricks, enemies) => {
    if(!board.isAt(myPosition.x, myPosition.y, Element.HERO_LADDER))
    {
        return null;
    }

    let y = myPosition.y;
    let bricksToEnemyCount = 0;
    while (!board.contains(walls, new Point(myPosition.x, y))) {
        y--;
        if(board.contains(bricks, new Point(myPosition.x, y)))
        {
            bricksToEnemyCount ++;
        }

        if (board.contains(enemies, new Point(myPosition.x, y))) {
            return new Shot(Math.abs(myPosition.y - y), bricksToEnemyCount + 1);
        }
    }

    return null;
}

const decreaseBulletCounter = (bullet_array) => {
    for (let i = 0; i < bullet_array.length; i++) {
        if (bullet_array[i].counter > 0) {
            bullet_array[i].counter--;
        }
        else if(bullet_array[i] != 0)
        {
            bullet_array[i] = 0;
        }
    }
}

const setBulletCounter = (bullet_array, coordinate, shot, shotIndex) => {
    const counter = shot.distance / 1.8 + shot.bulletsNumber;
    let counterToSet = 0;
    if(shot.bulletsNumber == shotIndex)
    {
        counterToSet = counter;
    }

    if (!bullet_array.find(bullet => bullet.coordinate === coordinate)) {
        bullet_array.push({ coordinate: coordinate, counter: counterToSet, shotsTotalCount: shot.bulletsNumber, shotsCount: shotIndex });
    } else {
        for (let i = 0; i < bullet_array.length; i++) {
            if (bullet_array[i].coordinate === coordinate) {
                bullet_array[i].counter = counterToSet;
                bullet_array[i].shotsCount = shotIndex;
                bullet_array[i].shotsTotalCount = shot.bulletsNumber;
                break;
            }
        }
    }
}

const isBotRight = (board, myPosition, robbers_cached) => {
    if ((
        (board.contains(robbers_cached, new Point(myPosition.x + 2, myPosition.y))
            && board.isAt(myPosition.x + 1, myPosition.y - 1, Element.BRICK)
            && !board.isAt(myPosition.x + 1, myPosition.y, Element.ROBBER_FALL))
        ||
        (board.contains(robbers_cached, new Point(myPosition.x + 3, myPosition.y))
            && board.isAt(myPosition.x + 2, myPosition.y - 1, Element.BRICK)
            && !board.isAt(myPosition.x + 1, myPosition.y, Element.ROBBER_FALL))
    )
        && !board.isAt(myPosition.x + 2, myPosition.y, Element.ROBBER_FALL)) {
        return true;
    }

    return false;
}

const isBotLeft = (board, myPosition, robbers_cached) => {
    if ((
        (board.contains(robbers_cached, new Point(myPosition.x - 2, myPosition.y))
            && !board.isAt(myPosition.x - 1, myPosition.y, Element.ROBBER_FALL)
            && board.isAt(myPosition.x - 1, myPosition.y - 1, Element.BRICK))
        || (board.contains(robbers_cached, new Point(myPosition.x - 3, myPosition.y))
            && board.isAt(myPosition.x - 2, myPosition.y - 1, Element.BRICK)
            && !board.isAt(myPosition.x - 2, myPosition.y, Element.ROBBER_FALL))
    )
        && !board.isAt(myPosition.x - 2, myPosition.y, Element.ROBBER_FALL)) {
        return true;
    }

    return false;
}

const pitNearExists = (board, myPosition, directionToCheck) => {
    const pitsArray = [Element.PIT_FILL_1, Element.PIT_FILL_2, Element.PIT_FILL_3, Element.PIT_FILL_4];

    if (directionToCheck == Direction.LEFT) {
        return board.isAtMany(myPosition.x - 1, myPosition.y - 1, pitsArray)
            || board.isAtMany(myPosition.x - 2, myPosition.y - 1, pitsArray);
    }

    if (directionToCheck == Direction.RIGHT) {
        return board.isAtMany(myPosition.x + 1, myPosition.y - 1, pitsArray)
            || board.isAtMany(myPosition.x + 2, myPosition.y - 1, pitsArray);
    }

    return false;
}

const digHoleIfNeeded = (board, myPosition, robbers_cached) => {
    if (isBotLeft(board, myPosition, robbers_cached) && !pitNearExists(board, myPosition, Direction.LEFT)) {
        return crack_left;
    }

    if (isBotRight(board, myPosition, robbers_cached) && !pitNearExists(board, myPosition, Direction.RIGHT)) {
        return crack_right;
    }

    return null;
}

const detectBullet = (board, myPosition, horizontalBullets, verticalBullets) => {
    let bulletDirection = null;

    for(let i = 0; i < 29; i ++)
    {
        if(board.isAt(i, myPosition.y, Element.BULLET) && !horizontalBullets.some(bullet => bullet.coordinate == myPosition.y && bullet.counter != 0)){
            if(i<myPosition.x){
                bulletDirection = GameConstants.left_direction;
            }
            else{
                bulletDirection = GameConstants.right_direction;
            }
        }
    }

    for(let i = 0; i < 29; i ++)
    {
        if(board.isAt(myPosition.y, i, Element.BULLET) && !verticalBullets.some(bullet => bullet.coordinate == myPosition.x && bullet.counter != 0)){
            if(i<myPosition.y){
                bulletDirection = GameConstants.down_direction;
            }
            else{
                bulletDirection = GameConstants.up_direction;
            }
        }
    }

    return bulletDirection;
}

module.exports = { getEnemyLeftShot, getEnemyRightShot, getEnemyUpShot, getEnemyDownShot, decreaseBulletCounter, setBulletCounter, digHoleIfNeeded, getFallingDownEnemyShot, detectBullet };