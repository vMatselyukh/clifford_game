/*-
 * #%L
 * Codenjoy - it's a dojo-like platform from developers to developers.
 * %%
 * Copyright (C) 2021 Codenjoy
 * %%
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public
 * License along with this program.  If not, see
 * <http://www.gnu.org/licenses/gpl-3.0.html>.
 * #L%
 */

const Games = require('./../../engine/games.js');
const Point = require('./../../engine/point.js');
const Direction = Games.require('./direction.js');
const Element = Games.require('./elements.js');
const Stuff = require('./../../engine/stuff.js');
const { getTheBestPath } = require("./bs/pathfinder");
const { getEnemyLeftDistance, getEnemyRightDistance,
  decreaseBulletCounter, setBulletCounter,
  digHoleIfNeeded } = require("./bs/enemydefender");
const board = require('../../engine/board.js');

const bullets_array = [];
const mask_potion_duration = 15;
let potion_time = 0;
let potion_taken = false;
let next_item = null;

var CliffordSolver = module.exports = {
  get: function (board) {
    decreaseBulletCounter(bullets_array);
    
    deactivateItem();
    activateNextItem();

    const robbers_cached = board.getRobbers();

    let myPosition = board.getHero();

    let digHoleIfNeededResult = digHoleIfNeeded(board, myPosition, robbers_cached);
    if (digHoleIfNeededResult !== null) {
      return selectDirection(digHoleIfNeededResult);
    }

    let myBullet = bullets_array.find(bullet => bullet.y == myPosition.y && bullet.counter > 0);

    const enemyLeftDistance = getEnemyLeftDistance(board, myPosition);
    const enemyRightDistance = getEnemyRightDistance(board, myPosition);

    if (enemyLeftDistance > 0 && myBullet === undefined) {
      setBulletCounter(bullets_array, myPosition.y, enemyLeftDistance);
      return Direction.SHOOT_LEFT;
    }
    else if (enemyRightDistance > 0 && myBullet === undefined) {
      setBulletCounter(bullets_array, myPosition.y, enemyRightDistance);
      return Direction.SHOOT_RIGHT;
    }

    let neededPath = getTheBestPath(board, myPosition);
    if (neededPath === null) {
      return Direction.STOP;
    }

    let stringDirection = neededPath.directions[1];
    setNextItem(board, neededPath.points[1]);

    return selectDirection(stringDirection);
  },
}

const selectDirection = (stringDirection) => {
  switch (stringDirection) {
    case "left":
      return Direction.LEFT;
    case "right":
      return Direction.RIGHT;
    case "up":
      return Direction.UP;
    case "down":
      return Direction.DOWN;
    case "sleftdown":
      return Direction.CRACK_LEFT;
    case "srightdown":
      return Direction.CRACK_RIGHT;
    default:
      return Direction.STOP;
  }
}

const setNextItem = (board, nextPoint) => {
  if(board.isAt(nextPoint.x, nextPoint.y, Element.MASK_POTION)) {
    next_item = Element.MASK_POTION;
  }
}

const activateNextItem = () => {
  if(next_item === Element.MASK_POTION) {
    potion_taken = true;
    potion_time = mask_potion_duration;
  }
}

const deactivateItem = () => {  
  if(potion_time > 0) {
    potion_time --;
  } else {
    potion_time = 0;
    potion_taken = false;
  }
}
