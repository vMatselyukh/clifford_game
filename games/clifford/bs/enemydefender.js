const Element = require("../elements.js");
const Direction = require("../direction.js");
const { Shot } = require("./shot"); 
const Point = require("./../../../engine/point.js");

const crack_left = "sleftdown";
const crack_right = "srightdown";

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
    }
}

const setBulletCounter = (bullet_array, coordinate, shot, shotIndex) => {
    const counter = shot.distance + shot.bulletsNumber;
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

module.exports = { getEnemyLeftShot, getEnemyRightShot, getEnemyUpShot, getEnemyDownShot, decreaseBulletCounter, setBulletCounter, digHoleIfNeeded };