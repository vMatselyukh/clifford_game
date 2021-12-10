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
let mortal_enemies_cached = [];
let enemies_cached = [];
let shootable_barriers_cached = [];
const match_found_key = "stop";
let search_for = "treasures"; // keys | enemies
let is_potion_active = false;

const getTreasuresOnBoard = (board) => {
    let treasures = board.getClues();
    let potions = board.getPotions();
    let keys = board.getKeys();

    return [...treasures, ...potions, ...keys];
}

const cacheThings = (board, isPotionActive, keys) => {
    barriers_cached = board.getBarriers(isPotionActive, keys);
    ground_cached = [...board.getWalls(), ...board.getLadders(), ...board.getOtherHeroes(), 
        ...board.getEnemyHeroes(), ...board.getRobbers(), ...board.getRobbersInPit()];
    ladders_cached = board.getLadders();
    shootable_barriers_cached = board.findAll(Element.BRICK);
    pipes_cached = board.getPipes();
    robbers_cached = isPotionActive ? [] : board.getRobbers();
    mortal_enemies_cached = board.getMortalEnemies();
    enemies_cached = board.getEnemies();
    is_potion_active = isPotionActive;

    initArrays();
    search_for = "treasures";
}

const initArrays = () => {
    visited_points = [];
}

const getTheBestPath = (board, myPosition, isPotionActive = false, keys = []) => {
    cacheThings(board, isPotionActive, keys);

    let theBestPath = findTheBestPathToTreasures(board, myPosition);

    if (theBestPath && theBestPath.points.length !== 1) {
        return theBestPath;
    } 
    
    initArrays();
    search_for = "portals";

    theBestPath = findTheBestPathToTreasures(board, myPosition);
    if (theBestPath && theBestPath.points.length !== 1) {
        return theBestPath;
    }

    initArrays();
    search_for = "enemies";
    barriers_cached = board.getBarriersWithoutEnemies(isPotionActive, keys);

    theBestPath = findTheBestPathToTreasures(board, myPosition);
    if (theBestPath && theBestPath.points.length !== 1) {
        return theBestPath;
    }
}

const findTheBestPathToTreasures = (board, myPosition) => {
    const allPaths = findPathsFromPoint(board, myPosition);

    let maxWeight = 0;
    let neededPath = null;
    for(let i = 0; i < allPaths.length; i++){
        if(allPaths[i].pathWeight > maxWeight
            && allPaths[i].notFalling){
            neededPath = allPaths[i];
            maxWeight = allPaths[i].pathWeight;
        }
    }

    return neededPath;
}

const findPathsFromPoint = (board, myPosition) => {
    let startPath = new CliffordPath([myPosition], [Direction.STOP]);
    let allPaths = [startPath];

    return findAllPaths(board, allPaths);
}

const isCharacterOnGroundOrPipeOrLadder = (board, path, myPosition, ground_cached_local, pipes_cached_local) => {
    return (board.isGroundAtCached(myPosition.x, myPosition.y - 1, ground_cached_local)
        && !board.contains(path.removedBarriers, new Point(myPosition.x, myPosition.y - 1))
        || board.isPipeAtCached(myPosition.x, myPosition.y, pipes_cached_local)
        || board.isAt(myPosition.x, myPosition.y, Element.HERO_LADDER))
        || board.isLadderAtCached(myPosition.x, myPosition.y, ladders_cached);
}

const isCharacterOnGround = (board, path, myPosition, ground_cached_local) => {
    return (board.isGroundAtCached(myPosition.x, myPosition.y - 1, ground_cached_local)
        && !board.contains(path.removedBarriers, new Point(myPosition.x, myPosition.y - 1)));
}

const addNextPointIfPossible = (board, position, direction, allPaths, index, checkForSafety) => {
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

        if(checkForSafety && !isTheNextPointSafe(board, nextPoint, direction)){
             return;
        }

        if ([GameConstants.shoot_left_down_direction, GameConstants.shoot_right_down_direction].includes(direction)) {
            if (!board.isBarrierAtCached(position.x + shootDownX, position.y, barriers_cached)) {
                processShootingInTheFloor(board, nextPoint, allPaths, index, direction);// === match_found_key
            }
        } else if (!board.contains(visited_points, nextPoint) || direction == GameConstants.falling_down_direction) {
            const treasure = getTreasureIfFound(board, nextPoint);
            const treasures = treasure != null ? [...allPaths[index].treasures, treasure] : allPaths[index].treasures;
            const isNextPointOnGround = isCharacterOnGroundOrPipeOrLadder(board, allPaths[index], new Point(nextPoint.x, nextPoint.y), ground_cached,
                pipes_cached);

            allPaths.push(new CliffordPath([...allPaths[index].points, nextPoint], [...allPaths[index].directions, direction],
                false, allPaths[index].removeBarriers, treasures, isNextPointOnGround));

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
            case Element.MASK_POTION:
                treasurePrice = GameConstants.mask_potion_price;
                break;
            case Element.BACKWAY:
                treasurePrice = GameConstants.portal_price;
                break;
        }
    } else if (search_for === "keys") {
        //implement me
    } else if (search_for === "enemies") {
        if (is_potion_active) {
            if (board.contains(enemies_cached, new Point(point.x, point.y))) {
                treasurePrice = 1;
            }
        } else if (board.contains(mortal_enemies_cached, new Point(point.x, point.y))) {
            treasurePrice = 1;
        }
    }

    if (treasurePrice > 0) {
        return new Treasure(treasurePrice, treasureElement, point);
    }

    return null;
}

const isTheNextPointSafe = (board, nextPoint, direction) => {
    if (
        board.isAt(nextPoint.x, nextPoint.y, Element.ROBBER_PIT)
        || board.contains(robbers_cached, new Point(nextPoint.x + 1, nextPoint.y + 1)) 
            && (direction == GameConstants.right_direction || direction == GameConstants.shoot_right_down_direction)  //up right
        || board.contains(robbers_cached, new Point(nextPoint.x, nextPoint.y + 1)) && direction != GameConstants.down_direction //up
        || board.contains(robbers_cached, new Point(nextPoint.x - 1, nextPoint.y + 1)) 
            && (direction == GameConstants.left_direction || direction == GameConstants.shoot_left_down_direction)
        || board.contains(robbers_cached, new Point(nextPoint.x + 1, nextPoint.y + 1)) && direction == GameConstants.right_direction
        || board.contains(robbers_cached, new Point(nextPoint.x, nextPoint.y - 1)) && !board.isAt(nextPoint.x, nextPoint.y - 1, Element.ROBBER_PIT)
        || board.contains(robbers_cached, new Point(nextPoint.x - 1, nextPoint.y)) 
            && (!board.isAt(nextPoint.x - 1, nextPoint.y, Element.ROBBER_PIT) || !board.isAt(nextPoint.x - 1, nextPoint.y, Element.ROBBER_FALL))
        || board.contains(robbers_cached, new Point(nextPoint.x + 1, nextPoint.y)) 
            && (!board.isAt(nextPoint.x + 1, nextPoint.y, Element.ROBBER_PIT) || !board.isAt(nextPoint.x + 1, nextPoint.y, Element.ROBBER_FALL))
        || board.contains(robbers_cached, new Point(nextPoint.x - 2, nextPoint.y)) && direction == GameConstants.shoot_left_down_direction
        || board.contains(robbers_cached, new Point(nextPoint.x + 2, nextPoint.y)) && direction == GameConstants.shoot_right_down_direction
        || board.contains(robbers_cached, new Point(nextPoint.x, nextPoint.y + 2)) && direction == GameConstants.up_direction
        || board.contains(robbers_cached, new Point(nextPoint.x - 1, nextPoint.y - 1)) 
            && !board.isGroundAtCached(nextPoint.x, nextPoint.y - 1, ground_cached)
            && !board.isAt(nextPoint.x - 1, nextPoint.y - 1, Element.ROBBER_PIT)
        || board.contains(robbers_cached, new Point(nextPoint.x + 1, nextPoint.y - 1)) 
            && !board.isGroundAtCached(nextPoint.x, nextPoint.y - 1, ground_cached)
            && !board.isAt(nextPoint.x + 1, nextPoint.y - 1, Element.ROBBER_PIT)
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
            || board.isAt(position.x + shootx, position.y, Element.HERO_RIGHT)))
        // && !board.contains(robbers_cached, new Point(position.x, position.y + 1))
        // && !board.contains(robbers_cached, new Point(position.x, position.y - 1))
        // && !board.contains(robbers_cached, new Point(position.x + 1, position.y))
        // && !board.contains(robbers_cached, new Point(position.x - 1, position.y))) 
        {

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
    let checkForSafety = false;

    for (let i = 0; i < allPathLength; i++) {
        if (allPaths[i].isFinished) {
            continue;
        }

        if(i <= 3){
            checkForSafety = true;
        }else{
            checkForSafety = false;
        }

        const theLastPoint = allPaths[i].points.slice(-1)[0];

        //go right if possible
        if (isCharacterOnGroundOrPipeOrLadder(board, allPaths[i], theLastPoint, ground_cached, pipes_cached)
            && addNextPointIfPossible(board, theLastPoint, GameConstants.right_direction, allPaths, i, checkForSafety)) {
            isMatchFound = true;
        }

        //go left if possible
        if (isCharacterOnGroundOrPipeOrLadder(board, allPaths[i], theLastPoint, ground_cached, pipes_cached)
            && addNextPointIfPossible(board, theLastPoint, GameConstants.left_direction, allPaths, i, checkForSafety)) {
            isMatchFound = true;
        }

        //go up if possible
        if (board.isLadderAtCached(theLastPoint.x, theLastPoint.y, ladders_cached)
            && addNextPointIfPossible(board, theLastPoint, GameConstants.up_direction, allPaths, i, checkForSafety)) {
            isMatchFound = true;
        }

        //go down if possible
        if ((board.isLadderAtCached(theLastPoint.x, theLastPoint.y, ladders_cached)
                || board.isLadderAtCached(theLastPoint.x, theLastPoint.y-1, ladders_cached)
                || board.isPipeAtCached(theLastPoint.x, theLastPoint.y, pipes_cached))
            && addNextPointIfPossible(board, theLastPoint, GameConstants.down_direction, allPaths, i, checkForSafety)) {
            isMatchFound = true;
        }

        //shoot left if possible
        if (isCharacterOnGround(board, allPaths[i], theLastPoint, ground_cached)
            && addNextPointIfPossible(board, theLastPoint, GameConstants.shoot_left_down_direction, allPaths, i, checkForSafety)) {
            isMatchFound = true;
        }

        //shoot right if possible
        if (isCharacterOnGround(board, allPaths[i], theLastPoint, ground_cached)
            && addNextPointIfPossible(board, theLastPoint, GameConstants.shoot_right_down_direction, allPaths, i, checkForSafety)) {
            isMatchFound = true;
        }

        //fall down if possible
        if (!isCharacterOnGroundOrPipeOrLadder(board, allPaths[i], theLastPoint, ground_cached, pipes_cached)
            && addNextPointIfPossible(board, theLastPoint, GameConstants.falling_down_direction, allPaths, i, checkForSafety)) {
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

const getRandomMovement = (board, myPosition) => {
    if(isCharacterOnGroundOrPipeOrLadder(board, new CliffordPath([], []), myPosition, ground_cached, pipes_cached))
    {
        if(isTheNextPointSafe(board, new Point(myPosition.x + 1, myPosition.y), Direction.RIGHT)){
            return GameConstants.right_direction;
        } else if(isTheNextPointSafe(board, new Point(myPosition.x - 1, myPosition.y), Direction.LEFT)){
            return GameConstants.left_direction;
        } else if(isTheNextPointSafe(board, new Point(myPosition.x, myPosition.y + 1), Direction.UP)
            && board.isAt(myPosition.x, myPosition.y + 1, Element.LADDER)){
            return GameConstants.up_direction;
        }  else if(isTheNextPointSafe(board, new Point(myPosition.x, myPosition.y - 1), Direction.DOWN)
            && !board.isGroundAtCached(myPosition.x, myPosition.y - 1, ground_cached)){
            return GameConstants.down_direction;
        }
    }

    if(!board.isGroundAtCached(myPosition.x + 1, myPosition.y, ground_cached))
    {
        return GameConstants.right_direction;
    }
    else if(!board.isGroundAtCached(myPosition.x - 1, myPosition.y, ground_cached))
    {
        return GameConstants.left_direction;
    }

    return GameConstants.right_direction;
}

// const hideFromBullet = (board, myPosition, bulletDirection) => {
//     switch(bulletDirection){
//         case GameConstants.left_direction:
//             if(board.isLadderAtCached(myPosition.x, myPosition.y + 1, ladders_cached))
//             {
//                 return GameConstants.up_direction;
//             }
//             if(board.isLadderAtCached(myPosition.x, myPosition.y-1, ladders_cached)
//                 || board.isPipeAtCached(myPosition.x, myPosition.y, pipes_cached))
//             {
//                 return GameConstants.down_direction;   
//             }
//             if(!board.contains(walls, myPosition.y, Element))
            
//     }
// }

module.exports = { getTreasuresOnBoard, findPathsFromPoint, getTheBestPath, getRandomMovement };