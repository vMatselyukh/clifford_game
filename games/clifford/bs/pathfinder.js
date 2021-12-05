const Element = require("../elements.js");
const Direction = require("../direction.js");
const Point = require("./../../../engine/point.js");
const { CliffordPath } = require("./path.js");

let treasures_cached = [];
let barriers_cached = [];
let ground_cached = [];
let pipes_cached = [];
let ladders_cached = [];
let shootable_barriers_cached = [];
const exit_from_loop = "stop";
const left_direction = "left";
const right_direction = "right";
const up_direction = "up";
const down_direction = "down";
const shoot_left_down_direction = "sleftdown";
const shoot_right_down_direction = "srightdown";

const findTheShortestPathToTreasures = (board, myPosition) => {

}

const getTreasuresOnBoard = (board) => {
    let treasures = board.getClues();
    let potions = board.getPotions();
    let keys = board.getKeys();

    return [...treasures, ...potions, ... keys];
}

const findPathsFromPoint = (board, myPosition) => {
    let startPath = new CliffordPath([myPosition],[Direction.STOP], false);
    let allPaths = [startPath];
    let visitedPoints = [];

    treasures_cached = getTreasuresOnBoard(board);
    barriers_cached = board.getBarriers();
    ground_cached = [...board.getWalls(), ...board.getLadders()];
    ladders_cached = board.getLadders();
    shootable_barriers_cached = board.findAll(Element.BRICK);
    pipes_cached = board.getPipes();

    return findAllPaths(board, allPaths, visitedPoints);
}

const getTheNextPoint = (board, path, myPosition, ground_cached_local, pipes_cached_local) => {
    if(board.contains(treasures_cached, myPosition))
    {
        return myPosition;
    }

    if(board.isGroundAtCached(myPosition.x, myPosition.y - 1, ground_cached_local)
        && !board.contains(path.removedBarriers, new Point(myPosition.x, myPosition.y - 1))
        || board.isPipeAtCached(myPosition.x, myPosition.y, pipes_cached_local))
    {
        return myPosition;
    }
    else {
        //character is falling down
        let newY = myPosition.y - 1;

        for(let i = newY; i >= 0; i--){
            if(board.isGroundAtCached(myPosition.x, i, ground_cached_local)
                && !board.contains(path.removedBarriers, new Point(myPosition.x, i)))
            {
                newY = i + 1;
                break;
            } 
            else if(board.isPipeAtCached(myPosition.x, i, pipes_cached_local))
            {
                newY = i;
                break;
            } else if (board.contains(treasures_cached, new Point(myPosition.x, i))){
                newY = i;
                break;
            }
        }

        return new Point(myPosition.x, newY);
    }
}

const addNextPointIfPossible = (board, position, direction, allPaths, visitedPointsList, index) => {
    let x = 0,
        y = 0;

    x = direction == right_direction ? 1 : x;
    x = direction == left_direction ? -1 : x;
    

    y = direction == up_direction ? 1 : y;
    y = direction == down_direction ? -1 : y;
    

    
    if (!board.isBarrierAtCached(position.x + x, position.y + y, barriers_cached)
        || board.contains(allPaths[index].removedBarriers, new Point(position.x + x, position.y + y))) {
        const nextPoint = getTheNextPoint(board, allPaths[index], new Point(position.x + x, position.y + y), ground_cached, pipes_cached);
        if(board.contains(treasures_cached, nextPoint))
        {
            allPaths.push(new CliffordPath([...allPaths[index].points, nextPoint], [...allPaths[index].directions, direction], true, true));
            return exit_from_loop;
        }

        if([shoot_left_down_direction, shoot_right_down_direction].includes(direction)) {
            processShootingInTheFloor(board, position, allPaths, index, direction);
            return;
        }

        if (!board.contains(visitedPointsList, nextPoint)) {
            allPaths.push(new CliffordPath([...allPaths[index].points, nextPoint], [...allPaths[index].directions, direction]));
        }
    }
}

const processShootingInTheFloor = (board, position, allPaths, index, direction) => {
    let shootx = 0,
        shooty = -1;
    const nextDirection = direction == shoot_left_down_direction ? left_direction : right_direction;

    shootx = direction == shoot_left_down_direction ? -1 : shootx;
    shootx = direction == shoot_right_down_direction ? 1 : shootx;    

    if(board.isShootableBarrierAtCached(position.x + shootx, position.y + shooty, shootable_barriers_cached)) {
        const removedBarrier = new Point(position.x + shootx, position.y + shooty);
        const removeBarriers = removedBarrier != null ? [...allPaths[index].removedBarriers, removedBarrier] : allPaths[index].removedBarriers;        

        allPaths[index].removedBarriers = removeBarriers;
        
        const nextPosition = getTheNextPoint(board, allPaths[index], new Point(position.x + shootx, position.y), ground_cached, pipes_cached);
        
        allPaths.push(new CliffordPath([...allPaths[index].points, position, nextPosition], 
                [...allPaths[index].directions, direction, nextDirection],
            false, false,
            _removedBarriers = removeBarriers));
    }
}

const findAllPaths = (board, allPaths, visitedPointsList) => {
    let allPathLength = allPaths.length;

    for(let i = 0; i < allPathLength; i ++)
    {
        if(allPaths[i].isFinished)
        {
            continue;
        }

        const theLastPoint = allPaths[i].points.slice(-1)[0];

        //go right if possible
        if(addNextPointIfPossible(board, theLastPoint, right_direction, allPaths, visitedPointsList, i) === exit_from_loop)
        {
            return allPaths;
        }

        //go left if possible
        if(addNextPointIfPossible(board, theLastPoint, left_direction, allPaths, visitedPointsList, i) === exit_from_loop)
        {
            return allPaths;
        }

        //go up if possible
        if(board.isLadderAtCached(theLastPoint.x, theLastPoint.y + 1, ladders_cached)
            && addNextPointIfPossible(board, theLastPoint, up_direction, allPaths, visitedPointsList, i) === exit_from_loop)
        {
            return allPaths;
        }

        //go down if possible
        if(addNextPointIfPossible(board, theLastPoint, down_direction, allPaths, visitedPointsList, i) === exit_from_loop)
        {
            return allPaths;
        }

        //shoot left if possible
        if(addNextPointIfPossible(board, theLastPoint, shoot_left_down_direction, allPaths, visitedPointsList, i) === exit_from_loop)
        {
            return allPaths;
        }

        //shoot right if possible
        if(addNextPointIfPossible(board, theLastPoint, shoot_right_down_direction, allPaths, visitedPointsList, i) === exit_from_loop)
        {
            return allPaths;
        }

        visitedPointsList.push(theLastPoint);
        allPaths[i].isFinished = true;
    }

    if(allPaths.every(path => path.isFinished)){
        return allPaths;
    }

    return findAllPaths(board, allPaths, visitedPointsList);
}

module.exports = { findTheShortestPathToTreasures, getTreasuresOnBoard, getTheNextPoint, findPathsFromPoint }