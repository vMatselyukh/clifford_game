const Element = require("../elements.js");
const Direction = require("../direction.js");
const Point = require("./../../../engine/point.js");
const { CliffordPath } = require("./path.js");
const { Treasure } = require("./treasure");
const { GameConstants } = require("./gameconstants");

let barriers_cached = [];
let ground_cached = [];
let pipes_cached = [];
let ladders_cached = [];
let robbers_cached = [];
let shootable_barriers_cached = [];
const match_found_key = "stop";
let finished_paths = [];
let search_for = "treasures"; //portals | keys

const getTreasuresOnBoard = (board) => {
    let treasures = board.getClues();
    let potions = board.getPotions();
    let keys = board.getKeys();

    return [...treasures, ...potions, ...keys];
}

const cacheThings = (board, isPotionActive, keys) => {
    barriers_cached = board.getBarriers(isPotionActive, keys);
    ground_cached = [...board.getWalls(), ...board.getLadders(), ...board.getOtherHeroes(), ...board.getEnemyHeroes(), ...board.getRobbers()];
    ladders_cached = board.getLadders();
    shootable_barriers_cached = board.findAll(Element.BRICK);
    pipes_cached = board.getPipes();
    robbers_cached = isPotionActive ? [] : board.getRobbers();

    initArrays();
    search_for = "treasures";
}

const initArrays = () => {
    finished_paths = [];
    visited_points = [];
}

const getTheBestPath = (board, myPosition, isPotionActive = false, keys = []) => {
    cacheThings(board, isPotionActive, keys);

    let theBestPath = findTheBestPathToTreasures(board, myPosition);

    if (theBestPath && theBestPath.points.length !== 1) {
        return theBestPath;
    } else {
        initArrays();
        search_for = "portals";
        return findTheBestPathToTreasures(board, myPosition);
    }
}

const findTheBestPathToTreasures = (board, myPosition) => {
    const allPaths = findPathsFromPoint(board, myPosition);

    const orderedPaths = allPaths
        .filter(path => path.isFinished)
        .sort((path1, path2) => path2.pathWeight - path1.pathWeight);

    if (orderedPaths.length > 0) {
        return orderedPaths[0];
    }

    return null;
}

const findPathsFromPoint = (board, myPosition) => {
    let startPath = new CliffordPath([myPosition], [Direction.STOP]);
    let allPaths = [startPath];

    return findAllPaths(board, allPaths);
}

const isCharacterOnGround = (board, path, myPosition, ground_cached_local, pipes_cached_local) => {
    return (board.isGroundAtCached(myPosition.x, myPosition.y - 1, ground_cached_local)
        && !board.contains(path.removedBarriers, new Point(myPosition.x, myPosition.y - 1))
        || board.isPipeAtCached(myPosition.x, myPosition.y, pipes_cached_local));
}

const addNextPointIfPossible = (board, position, direction, allPaths, index) => {
    let x = 0,
        y = 0,
        shootDownX = 0;

    x = direction == GameConstants.right_direction ? 1 : x;
    x = direction == GameConstants.left_direction ? -1 : x;

    y = direction == GameConstants.up_direction ? 1 : y;
    y = direction == GameConstants.down_direction ? -1 : y;
    y = direction == GameConstants.falling_down_direction ? -1 : y;

    shootDownX = direction == GameConstants.shoot_left_down_direction ? -1 : shootDownX;
    shootDownX = direction == GameConstants.shoot_right_down_direction ? 1 : shootDownX;

    if (!board.isBarrierAtCached(position.x + x, position.y + y, barriers_cached)
        || board.contains(allPaths[index].removedBarriers, new Point(position.x + x, position.y + y))) {

        const nextPoint = new Point(position.x + x, position.y + y);

        if ([GameConstants.shoot_left_down_direction, GameConstants.shoot_right_down_direction].includes(direction)) {
            if (!board.isBarrierAtCached(position.x + shootDownX, position.y, barriers_cached)) {
                processShootingInTheFloor(board, nextPoint, allPaths, index, direction);// === match_found_key
            }
        } else if (!board.contains(visited_points, nextPoint)) {
            const treasure = getTreasureIfFound(board, nextPoint);
            const treasures = treasure != null ? [...allPaths[index].treasures, treasure] : allPaths[index].treasures;

            allPaths.push(new CliffordPath([...allPaths[index].points, nextPoint], [...allPaths[index].directions, direction],
                false, allPaths[index].removeBarriers, treasures));

            addNodeToVisited(board, nextPoint);
        }
    }
}

const getTreasureIfFound = (board, point) => {
    const treasureElement = board.getAt(point.x, point.y);
    let treasurePrice = 0;

    if (search_for === "treasures") {

        switch (treasureElement) {
            case Element.CLUE_KNIFE:
                treasurePrice = GameConstants.knife_clue_price;
                break;
            case Element.CLUE_GLOVE:
                treasurePrice = GameConstants.glow_clue_price;
                break;
            case Element.CLUE_RING:
                treasurePrice = GameConstants.ring_clue_price;
                break;
        }
    } else if (search_for === "portals"
        && treasureElement === Element.BACKWAY) {
        treasurePrice = 1;
    } else if (search_for === "keys") {
        //implement me
    }

    if (treasurePrice > 0) {
        return new Treasure(treasurePrice, treasureElement, point);
    }

    return null;

}

const isTheNextPointSafe = (board, nextPoint, myPosition) => {
    if (board.contains(robbers_cached, new Point(nextPoint.x + 1, nextPoint.y + 1)) && !board.contains(robbers_cached, new Point(myPosition.x, myPosition.y + 1))
        || board.contains(robbers_cached, new Point(nextPoint.x - 1, nextPoint.y + 1)) && !board.contains(robbers_cached, new Point(myPosition.x, myPosition.y + 1))
        || board.contains(robbers_cached, new Point(nextPoint.x + 1, nextPoint.y - 1)) && !board.contains(robbers_cached, new Point(myPosition.x, myPosition.y))
        || board.contains(robbers_cached, new Point(nextPoint.x - 1, nextPoint.y - 1)) && !board.isAt(myPosition.x, myPosition.y, Element.HERO_LADDER)
        || board.contains(robbers_cached, new Point(nextPoint.x - 1, nextPoint.y))
        || board.contains(robbers_cached, new Point(nextPoint.x + 1, nextPoint.y))
    ) {
        return false;
    }

    return true;
}

const processShootingInTheFloor = (board, position, allPaths, index, direction) => {
    let shootx = 0,
        shooty = -1;
    const nextDirection = direction == GameConstants.shoot_left_down_direction ? GameConstants.left_direction : GameConstants.right_direction;

    shootx = direction == GameConstants.shoot_left_down_direction ? -1 : shootx;
    shootx = direction == GameConstants.shoot_right_down_direction ? 1 : shootx;

    const shootingPoint = new Point(position.x + shootx, position.y + shooty);

    if (!board.contains(visited_points, shootingPoint)
        && board.isShootableBarrierAtCached(position.x + shootx, position.y + shooty, shootable_barriers_cached)
        && (board.isAt(position.x + shootx, position.y, Element.NONE)
            || board.isAt(position.x + shootx, position.y, Element.HERO_LEFT)
            || board.isAt(position.x + shootx, position.y, Element.HERO_RIGHT))
        && !board.contains(robbers_cached, new Point(position.x, position.y + 1))
        && !board.contains(robbers_cached, new Point(position.x, position.y - 1))
        && !board.contains(robbers_cached, new Point(position.x + 1, position.y))
        && !board.contains(robbers_cached, new Point(position.x - 1, position.y))) {

        const removedBarrier = new Point(position.x + shootx, position.y + shooty);
        const removedBarriers = removedBarrier != null ? [...allPaths[index].removedBarriers, removedBarrier] : allPaths[index].removedBarriers;

        const nextPoint = new Point(position.x + shootx, position.y);

        const treasure = getTreasureIfFound(board, nextPoint);
        const treasures = treasure != null ? [...allPaths[index].treasures, treasure] : allPaths[index].treasures;

        allPaths.push(new CliffordPath([...allPaths[index].points, position, nextPoint],
            [...allPaths[index].directions, direction, nextDirection],
            false,
            removedBarriers, treasures));

        addNodeToVisited(board, nextPoint);
    }
}

const addNodeToVisited = (board, nextPoint) => {
    if (!board.contains(visited_points, nextPoint)) {
        visited_points.push(nextPoint);
    }
}

const findAllPaths = (board, allPaths) => {
    let allPathLength = allPaths.length;

    for (let i = 0; i < allPathLength; i++) {
        if (allPaths[i].isFinished) {
            continue;
        }

        const theLastPoint = allPaths[i].points.slice(-1)[0];

        //go right if possible
        if (isCharacterOnGround(board, allPaths[i], theLastPoint, ground_cached, pipes_cached)
            && addNextPointIfPossible(board, theLastPoint, GameConstants.right_direction, allPaths, i) === match_found_key) {
            isMatchFound = true;
        }

        //go left if possible
        if (isCharacterOnGround(board, allPaths[i], theLastPoint, ground_cached, pipes_cached)
            && addNextPointIfPossible(board, theLastPoint, GameConstants.left_direction, allPaths, i) === match_found_key) {
            isMatchFound = true;
        }

        //go up if possible
        if (board.isLadderAtCached(theLastPoint.x, theLastPoint.y, ladders_cached)
            && addNextPointIfPossible(board, theLastPoint, GameConstants.up_direction, allPaths, i) === match_found_key) {
            isMatchFound = true;
        }

        //go down if possible
        if ((!board.isBarrierAtCached(theLastPoint.x, theLastPoint.y - 1, barriers_cached)
            &&
            (board.isLadderAtCached(theLastPoint.x, theLastPoint.y, ladders_cached)
                || board.isPipeAtCached(theLastPoint.x, theLastPoint.y, pipes_cached)))
            && addNextPointIfPossible(board, theLastPoint, GameConstants.down_direction, allPaths, i) === match_found_key) {
            isMatchFound = true;
        }

        //shoot left if possible
        if (addNextPointIfPossible(board, theLastPoint, GameConstants.shoot_left_down_direction, allPaths, i) === match_found_key) {
            isMatchFound = true;
        }

        //shoot right if possible
        if (addNextPointIfPossible(board, theLastPoint, GameConstants.shoot_right_down_direction, allPaths, i) === match_found_key) {
            isMatchFound = true;
        }

        //fall down if possible
        if (!isCharacterOnGround(board, allPaths[i], theLastPoint, ground_cached, pipes_cached)
            && addNextPointIfPossible(board, theLastPoint, GameConstants.falling_down_direction, allPaths, i) === match_found_key) {
            isMatchFound = true;
        }

        addNodeToVisited(board, theLastPoint);

        allPaths[i].isFinished = true;
    }

    if (allPaths.every(path => path.isFinished)) {
        return allPaths;
    }

    return findAllPaths(board, allPaths);
}

module.exports = { getTreasuresOnBoard, findPathsFromPoint, getTheBestPath };