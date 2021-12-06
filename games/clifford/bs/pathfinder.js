const Element = require("../elements.js");
const Direction = require("../direction.js");
const Point = require("./../../../engine/point.js");
const { CliffordPath } = require("./path.js");

let treasures_cached = [];
let barriers_cached = [];
let ground_cached = [];
let pipes_cached = [];
let ladders_cached = [];
let robbers_cached = [];
let shootable_barriers_cached = [];
const match_found_key = "stop";
const left_direction = "left";
const right_direction = "right";
const up_direction = "up";
const down_direction = "down";
const shoot_left_down_direction = "sleftdown";
const shoot_right_down_direction = "srightdown";
const loops_till_end = 3;

const getTreasuresOnBoard = (board) => {
    let treasures = board.getClues();
    let potions = board.getPotions();
    let keys = board.getKeys();

    return [...treasures, ...potions, ...keys];
}

const cacheThings = (board, isPotionActive, keys) => {
    treasures_cached = getTreasuresOnBoard(board);
    barriers_cached = board.getBarriers(isPotionActive, keys);
    ground_cached = [...board.getWalls(), ...board.getLadders(), ...board.getOtherHeroes(), ...board.getEnemyHeroes(), ...board.getRobbers()];
    ladders_cached = board.getLadders();
    shootable_barriers_cached = board.findAll(Element.BRICK);
    pipes_cached = board.getPipes();
    robbers_cached = isPotionActive ? [] : board.getRobbers();
}

const getTheBestPath = (board, myPosition, isPotionActive = false, keys = []) => {
    cacheThings(board, isPotionActive, keys);

    let theBestPath = findTheBestPathToTreasures(board, myPosition);

    if (theBestPath) {
        return theBestPath;
    } else {
        treasures_cached = board.getBackWays();
        return findTheBestPathToTreasures(board, myPosition);
    }
}

const findTheBestPathToTreasures = (board, myPosition) => {
    const allPaths = findPathsFromPoint(board, myPosition);

    const orderedPaths = allPaths
        .filter(path => path.isFinished && path.isTreasureFound)
        .sort((path1, path2) => (path1.pathLength + path1.directionsLength) - (path2.pathLength + path2.directionsLength));

    if (orderedPaths.length > 0) {
        return orderedPaths[0];
    }

    return null;
}

const findPathsFromPoint = (board, myPosition) => {
    let startPath = new CliffordPath([myPosition], [Direction.STOP], 0, false);
    let allPaths = [startPath];
    let visitedPoints = [];

    return findAllPaths(board, allPaths, visitedPoints);
}

const getTheNextPoint = (board, path, myPosition, ground_cached_local, pipes_cached_local) => {
    if (board.contains(treasures_cached, myPosition)) {
        return myPosition;
    }

    if (board.isGroundAtCached(myPosition.x, myPosition.y - 1, ground_cached_local)
        && !board.contains(path.removedBarriers, new Point(myPosition.x, myPosition.y - 1))
        || board.isPipeAtCached(myPosition.x, myPosition.y, pipes_cached_local)) {
        return myPosition;
    }
    else {
        //character is falling down
        let newY = myPosition.y - 1;

        for (let i = newY; i >= 0; i--) {
            path.pathLength ++;
            if (board.isGroundAtCached(myPosition.x, i, ground_cached_local)
                && !board.contains(path.removedBarriers, new Point(myPosition.x, i))) {
                newY = i + 1;
                break;
            }
            else if (board.isPipeAtCached(myPosition.x, i, pipes_cached_local)) {
                newY = i;
                break;
            } else if (board.contains(treasures_cached, new Point(myPosition.x, i))) {
                newY = i;
                break;
            }
        }

        return new Point(myPosition.x, newY);
    }
}

const addNextPointIfPossible = (board, position, direction, allPaths, visitedPointsList, index) => {
    let x = 0,
        y = 0,
        shootDownX = 0;

    x = direction == right_direction ? 1 : x;
    x = direction == left_direction ? -1 : x;

    y = direction == up_direction ? 1 : y;
    y = direction == down_direction ? -1 : y;

    shootDownX = direction == shoot_left_down_direction ? -1 : shootDownX;
    shootDownX = direction == shoot_right_down_direction ? 1 : shootDownX;

    if (!board.isBarrierAtCached(position.x + x, position.y + y, barriers_cached)
        && !board.isBarrierAtCached(position.x + shootDownX, position.y + y, barriers_cached)
        || board.contains(allPaths[index].removedBarriers, new Point(position.x + x, position.y + y))) {
        const nextPoint = getTheNextPoint(board, allPaths[index], new Point(position.x + x, position.y + y), ground_cached, pipes_cached);

        if(!isTheNextPointSafe(board, nextPoint, position))
        {
            return;
        }

        if (board.contains(treasures_cached, nextPoint)) {
            allPaths.push(new CliffordPath([...allPaths[index].points, nextPoint], [...allPaths[index].directions, direction], allPaths[index].pathLength, true, true));
            return match_found_key;
        }

        if ([shoot_left_down_direction, shoot_right_down_direction].includes(direction)) {
            if (processShootingInTheFloor(board, position, allPaths, index, direction) === match_found_key) {
                return match_found_key;
            }
        }

        if (!board.contains(visitedPointsList, nextPoint)) {
            allPaths.push(new CliffordPath([...allPaths[index].points, nextPoint], [...allPaths[index].directions, direction], allPaths[index].pathLength));
        }
    }
}

const isTheNextPointSafe = (board, nextPoint, myPosition) => {
    if(board.contains(robbers_cached, new Point(nextPoint.x+1, nextPoint.y+1)) && !board.contains(robbers_cached, new Point(myPosition.x, myPosition.y+1))
        || board.contains(robbers_cached, new Point(nextPoint.x-1, nextPoint.y+1)) && !board.contains(robbers_cached, new Point(myPosition.x, myPosition.y+1))
        || board.contains(robbers_cached, new Point(nextPoint.x+1, nextPoint.y-1)) && !board.contains(robbers_cached, new Point(myPosition.x, myPosition.y))
        || board.contains(robbers_cached, new Point(nextPoint.x-1, nextPoint.y-1)) && !board.isAt(myPosition.x, myPosition.y, Element.HERO_LADDER)
        || board.contains(robbers_cached, new Point(nextPoint.x-1, nextPoint.y))
        || board.contains(robbers_cached, new Point(nextPoint.x+1, nextPoint.y))
    ) {
        return false;
    }

    return true;
}

const processShootingInTheFloor = (board, position, allPaths, index, direction) => {
    let shootx = 0,
        shooty = -1;
    const nextDirection = direction == shoot_left_down_direction ? left_direction : right_direction;

    shootx = direction == shoot_left_down_direction ? -1 : shootx;
    shootx = direction == shoot_right_down_direction ? 1 : shootx;

    if (board.isShootableBarrierAtCached(position.x + shootx, position.y + shooty, shootable_barriers_cached)
        && board.isAt(position.x + shootx, position.y, Element.NONE)
        && !board.contains(robbers_cached, new Point(position.x, position.y + 1))
        && !board.contains(robbers_cached, new Point(position.x, position.y - 1))
        && !board.contains(robbers_cached, new Point(position.x + 1, position.y))
        && !board.contains(robbers_cached, new Point(position.x - 1, position.y))) {
        const removedBarrier = new Point(position.x + shootx, position.y + shooty);
        const removeBarriers = removedBarrier != null ? [...allPaths[index].removedBarriers, removedBarrier] : allPaths[index].removedBarriers;

        allPaths[index].removedBarriers = removeBarriers;

        const nextPosition = getTheNextPoint(board, allPaths[index], new Point(position.x + shootx, position.y), ground_cached, pipes_cached);

        if (board.contains(treasures_cached, nextPosition)) {
            allPaths.push(new CliffordPath([...allPaths[index].points, position, nextPosition],
                [...allPaths[index].directions, direction, nextDirection],
                allPaths[index].pathLength,
                true, true,
                _removedBarriers = removeBarriers));

            return match_found_key;
        }

        allPaths.push(new CliffordPath([...allPaths[index].points, position, nextPosition],
            [...allPaths[index].directions, direction, nextDirection],
            allPaths[index].pathLength,
            false, false,
            _removedBarriers = removeBarriers));
    }
}

const findAllPaths = (board, allPaths, visitedPointsList, endloop = -1) => {
    let allPathLength = allPaths.length;
    let isMatchFound = false;

    for (let i = 0; i < allPathLength; i++) {
        if (allPaths[i].isFinished) {
            continue;
        }

        const theLastPoint = allPaths[i].points.slice(-1)[0];

        //go right if possible
        if (addNextPointIfPossible(board, theLastPoint, right_direction, allPaths, visitedPointsList, i) === match_found_key) {
            isMatchFound = true;
        }

        //go left if possible
        if (addNextPointIfPossible(board, theLastPoint, left_direction, allPaths, visitedPointsList, i) === match_found_key) {
            isMatchFound = true;
        }

        //go up if possible
        if (board.isLadderAtCached(theLastPoint.x, theLastPoint.y, ladders_cached)
            && addNextPointIfPossible(board, theLastPoint, up_direction, allPaths, visitedPointsList, i) === match_found_key) {
            isMatchFound = true;
        }

        //go down if possible
        if (addNextPointIfPossible(board, theLastPoint, down_direction, allPaths, visitedPointsList, i) === match_found_key) {
            isMatchFound = true;
        }

        //shoot left if possible
        if (addNextPointIfPossible(board, theLastPoint, shoot_left_down_direction, allPaths, visitedPointsList, i) === match_found_key) {
            isMatchFound = true;
        }

        //shoot right if possible
        if (addNextPointIfPossible(board, theLastPoint, shoot_right_down_direction, allPaths, visitedPointsList, i) === match_found_key) {
            isMatchFound = true;
        }

        visitedPointsList.push(theLastPoint);
        allPaths[i].isFinished = true;
    }

    if (allPaths.every(path => path.isFinished)) {
        return allPaths;
    }

    if (endloop === 0) {
        return allPaths;
    }

    if (isMatchFound || endloop !== -1) {
        if (endloop === -1) {
            return findAllPaths(board, allPaths, visitedPointsList, loops_till_end);
        } else {
            return findAllPaths(board, allPaths, visitedPointsList, --endloop);
        }
    }

    return findAllPaths(board, allPaths, visitedPointsList);
}

module.exports = { getTreasuresOnBoard, getTheNextPoint, findPathsFromPoint, getTheBestPath }