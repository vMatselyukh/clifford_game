const Element = require("../elements.js");
const Direction = require("../direction.js");
const Point = require("./../../../engine/point.js");

const crack_left = "sleftdown";
const crack_right = "srightdown";

const getEnemyLeftDistance = (board, myPosition) => {
    const walls = board.getWalls();
    const enemies = board.getEnemies();

    let x = myPosition.x;
    while (!board.contains(walls, new Point(x, myPosition.y))) {
        x--;
        if (board.contains(enemies, new Point(x, myPosition.y))) {
            return Math.abs(myPosition.x - x);
        }
    }

    return 0;
}

const getEnemyRightDistance = (board, myPosition) => {
    const walls = board.getWalls();
    const enemies = board.getEnemies();

    let x = myPosition.x;
    while (!board.contains(walls, new Point(x, myPosition.y))) {
        x++;
        if (board.contains(enemies, new Point(x, myPosition.y))) {
            return Math.abs(myPosition.x - x);
        }
    }

    return 0;
}

const decreaseBulletCounter = (bullet_array) => {
    for (let i = 0; i < bullet_array.length; i++) {
        if (bullet_array[i].counter > 0) {
            bullet_array[i].counter--;
        }
    }
}

const setBulletCounter = (bullet_array, y, distance) => {
    const counter = distance / 1;
    if (counter < 1) {
        counter = 2;
    }
    if (!bullet_array.find(bullet => bullet.y === y)) {
        bullet_array.push({ y: y, counter: counter });
    } else {
        for (let i = 0; i < bullet_array.length; i++) {
            if (bullet_array[i].y === y) {
                bullet_array[i].counter = counter;
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

module.exports = { getEnemyLeftDistance, getEnemyRightDistance, decreaseBulletCounter, setBulletCounter, digHoleIfNeeded };