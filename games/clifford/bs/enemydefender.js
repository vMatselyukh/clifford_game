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
    if(counter === 0){
        counter = 1;
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
    if (board.contains(robbers_cached, new Point(myPosition.x + 2, myPosition.y))) {
        return true;
    }

    return false;
}

const isBotLeft = (board, myPosition, robbers_cached) => {
    if (board.contains(robbers_cached, new Point(myPosition.x - 2, myPosition.y))) {
        return true;
    }

    return false;
}

const digHoleIfNeeded = (board, myPosition, robbers_cached) => {
    if (isBotLeft(board, myPosition, robbers_cached)
        && board.isAt(myPosition.x - 1, myPosition.y - 1, Element.BRICK)) {
        return crack_left;
    }

    if (isBotRight(board, myPosition, robbers_cached)
        && board.isAt(myPosition.x + 1, myPosition.y - 1, Element.BRICK)) {
        return crack_right;
    }

    return null;
}

module.exports = { getEnemyLeftDistance, getEnemyRightDistance, decreaseBulletCounter, setBulletCounter, digHoleIfNeeded };