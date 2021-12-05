const Point = require("./../../../engine/point.js");

const isEnemyLeft = (board, myPosition) => {
    const walls = board.getWalls();
    const enemies = board.getEnemies();

    let x = myPosition.x;
    while (!board.contains(walls, new Point(x, myPosition.y))) {
        x--;
        if (board.contains(enemies, new Point(x, myPosition.y))) {
            return true;
        }
    }

    return false;
}

const isEnemyRight = (board, myPosition) => {
    const walls = board.getWalls();
    const enemies = board.getEnemies();

    let x = myPosition.x;
    while (!board.contains(walls, new Point(x, myPosition.y))) {
        x++;
        if (board.contains(enemies, new Point(x, myPosition.y))) {
            return true;
        }
    }

    return false;
}

const decreaseBulletCounter = (bullet_array) => {
    for (let i = 0; i < bullet_array.length; i++) {
        if (bullet_array[i].counter > 0) {
            bullet_array[i].counter--;
        }
    }
}

module.exports = { isEnemyLeft, isEnemyRight, decreaseBulletCounter }