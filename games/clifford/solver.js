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
const { findPathsFromPoint } = require("./bs/pathfinder");
const { isEnemyLeft, isEnemyRight, decreaseBulletCounter } = require("./bs/enemydefender");

const bullets_array = [];

const isRobberLeft = (board, myPosition) => {
  let robberPosition = -1;

  for (let i = 0; i < myPosition.x; i++) {
    if (board.isAt(i, myPosition.y, Element.ROBBER_LADDER)
      || board.isAt(i, myPosition.y, Element.ROBBER_LEFT)
      || board.isAt(i, myPosition.y, Element.ROBBER_RIGHT)
    )
      return true;
  }

  if (Math.abs(robberPosition - myPosition.x) > 2 && robberPosition !== -1) {
    return true;
  }

  return false;
}

const isRobberRight = (board, myPosition) => {
  let robberPosition = -1;
  for (let i = myPosition.x; i < 29; i++) {
    if (board.isAt(i, myPosition.y, Element.ROBBER_LADDER)
      || board.isAt(i, myPosition.y, Element.ROBBER_LEFT)
      || board.isAt(i, myPosition.y, Element.ROBBER_RIGHT)
    )
      robberPosition = i;
  }

  if (Math.abs(robberPosition - myPosition.x) > 2 && robberPosition !== -1) {
    return true;
  }

  return false;
}

const getLeftTreasureXPosition = (board, myPosition) => {
  return getLeftThingsPosition(board, myPosition, [Element.CLUE_KNIFE, Element.CLUE_GLOVE, Element.CLUE_RING, Element.MASK_POTION]);
}

const getRightTreasureXPosition = (board, myPosition) => {
  return getRightThingsPosition(board, myPosition, [Element.CLUE_KNIFE, Element.CLUE_GLOVE, Element.CLUE_RING, Element.MASK_POTION]);
}

const getLeftThingsPosition = (board, myPosition, things) => {
  for (let i = myPosition.x; i > 0; i--) {
    if (board.isAtMany(i, myPosition.y, things)) {
      return i;
    }
  }

  return -1;
}

const getRightThingsPosition = (board, myPosition, things) => {
  for (let i = myPosition.x; i < 29; i++) {
    if (board.isAtMany(i, myPosition.y, things)) {
      return i;
    }
  }

  return -1;
}

const canIMoveToThePointHorizontally = (board, myPosition, pointXPosition) => {
  if (myPosition.x > pointXPosition) {
    for (let i = myPosition.x - 1; i > pointXPosition; i--) {
      if (board.isAt(i, myPosition.y, Element.STONE)) {
        return false;
      }

      if (!board.isAt(i, myPosition.y - 1, Element.BRICK)
        && !board.isAt(i, myPosition.y - 1, Element.STONE)
        && !board.isAt(i, myPosition.y - 1, Element.LADDER)) {
        return false;
      }
    }

    return true;
  }

  if (myPosition.x < pointXPosition) {
    for (let i = myPosition.x + 1; i < pointXPosition; i++) {
      if (board.isAt(i, myPosition.y, Element.STONE)) {
        return false;
      }

      if (!board.isAt(i, myPosition.y - 1, Element.BRICK)
        && !board.isAt(i, myPosition.y - 1, Element.STONE)
        && !board.isAt(i, myPosition.y - 1, Element.LADDER)) {
        return false;
      }
    }

    return true;
  }

  return true;
}

const findTheNearestTreasureOnCurrentLevel = (board, myPosition) => {
  const leftTreasureXPosition = getLeftTreasureXPosition(board, myPosition);
  const rightTreasureXPosition = getRightTreasureXPosition(board, myPosition);

  const leftDistance = Math.abs(myPosition.x - leftTreasureXPosition);
  const rightDistance = Math.abs(myPosition.x - rightTreasureXPosition);

  if (leftDistance < rightDistance && canIMoveToThePointHorizontally(board, myPosition, leftTreasureXPosition) && leftTreasureXPosition !== -1) {
    return Direction.LEFT;
  }
  else if (canIMoveToThePointHorizontally(board, myPosition, rightTreasureXPosition) && rightTreasureXPosition !== -1) {
    return Direction.RIGHT;
  }

  return Direction.STOP;
}

const findTheNearestLadder = (board, myPosition) => {
  const leftLadderXPosition = getLeftThingsPosition(board, myPosition, [Element.LADDER]);
  const rightLadderXPosition = getRightThingsPosition(board, myPosition, [Element.LADDER]);

  const leftDistance = Math.abs(myPosition.x - leftLadderXPosition);
  const rightDistance = Math.abs(myPosition.x - rightLadderXPosition);

  if (leftDistance < rightDistance && canIMoveToThePointHorizontally(board, myPosition, leftLadderXPosition) && leftLadderXPosition !== -1) {
    return Direction.LEFT;
  }
  else if (canIMoveToThePointHorizontally(board, myPosition, rightLadderXPosition) && rightLadderXPosition !== -1) {
    return Direction.RIGHT;
  }

  return Direction.STOP;
}

const moveOnLadder = (board, myPosition) => {
  if (ladderDirection == Direction.UP &&
    (board.isAt(myPosition.x, myPosition.y + 1, Element.STONE)
      || board.isAt(myPosition.x, myPosition.y + 1, Element.BRICK))) {
    ladderDirection = Direction.DOWN;
  }

  if (ladderDirection == Direction.DOWN && (board.isAt(myPosition.x, myPosition.y + 1, Element.STONE)
    || board.isAt(myPosition.x, myPosition.y + 1, Element.BRICK))
  ) {
    ladderDirection = Direction.UP;
  }

  if (ladderDirection) {
    return ladderDirection;
  }

  if (board.isAt(myPosition.x, myPosition.y + 1, Element.LADDER)) {
    ladderDirection = Direction.UP;
    return Direction.UP;
  }

  if (board.isAt(myPosition.x, myPosition.y - 1, Element.LADDER)) {
    ladderDirection = Direction.DOWN;
    return Direction.DOWN;
  }

  return Direction.STOP;
}

const canIWalkToThePoint = (board, myPosition, desiredPosition) => {


  for (let i = myPosition.x; i < 29; i++) {
    if (board.isAt(i, myPosition.y, Element.CLUE_KNIFE)
      || board.isAt(i, myPosition.y, Element.CLUE_GLOVE)
      || board.isAt(i, myPosition.y, Element.CLUE_RING)
      || board.isAt(i, myPosition.y, Element.MASK_POTION)
    )
      return true;
  }

  return false;
}

// let ladderDirection = Direction.UP;

// console.log("my position", myPosition);

//     for (let i = 0; i < 29; i++) {

//       if (isEnemyLeft(board, myPosition)) {
//         return Direction.SHOOT_LEFT;
//       }
//       if (isEnemyRight(board, myPosition)) {
//         return Direction.SHOOT_RIGHT;
//       }
//       if (isRobberLeft(board, myPosition)) {
//         return Direction.CRACK_LEFT;
//       }
//       if (isRobberRight(board, myPosition)) {
//         return Direction.CRACK_RIGHT;
//       }
//       let nearestTreasureMove = findTheNearestTreasureOnCurrentLevel(board, myPosition);
//       if(nearestTreasureMove !== Direction.STOP)
//       {
//         ladderDirection = null;
//         return nearestTreasureMove;
//       }

//       let nearestLadder = findTheNearestLadder(board, myPosition);
//       if(nearestLadder !== Direction.STOP)
//       {
//         return nearestLadder;
//       }

//       let moveOnLadderDirection = moveOnLadder(board, myPosition);
//       if(moveOnLadderDirection !== Direction.STOP)
//       {
//         return moveOnLadderDirection;
//       }
//     }

var CliffordSolver = module.exports = {
  get: function (board) {
    decreaseBulletCounter(bullets_array);
    
    let myPosition = board.getHero();

    let paths = findPathsFromPoint(board, myPosition);

    let neededPath = paths.slice(-1)[0];
    let stringDirection = neededPath.directions[1];

    let myBullet = bullets_array.find(bullet => bullet.y == myPosition.y && bullet.counter > 0);

    if(isEnemyLeft(board, myPosition) && !myBullet)
    {
      bullets_array.push({y: myPosition.y, counter:5});
      return Direction.SHOOT_LEFT;
    }
    else if(isEnemyRight(board, myPosition) && !myBullet)
    {
      bullets_array.push({y: myPosition.y, counter:5});
      return Direction.SHOOT_RIGHT;
    }

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
        Direction.STOP;
    }
  },
};
