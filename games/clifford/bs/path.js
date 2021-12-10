const { Treasure } = require("./treasure");

class CliffordPath {
    points = [];
    directions = [];
    removedBarriers = [];
    treasures = [];
    isFinished = false;
    notFalling = true;
    
    constructor(_points, _directions, _isFinished=false, _removedBarriers=[], _treasures=[], notFalling = true)
    {
        this.points = _points;
        this.directions = _directions;
        this.isFinished = _isFinished;
        this.removedBarriers = _removedBarriers;
        this.treasures = _treasures;
        this.notFalling = notFalling;
    }

    get directionsLength() {
        return this.directions.length;
    }

    get pathWeight(){
        const weight = (this.treasures.map(treasure => treasure.pointsPrice).reduce((t1, t2) => {
            return t1 + t2;
        }, 0)  / this.directionsLength);

        return weight;
    }
}

module.exports.CliffordPath = CliffordPath;