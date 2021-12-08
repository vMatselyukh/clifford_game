const { Treasure } = require("./treasure");

class CliffordPath {
    points = [];
    directions = [];
    removedBarriers = [];
    treasures = [];
    isFinished = false;
    
    constructor(_points, _directions, _isFinished=false, _removedBarriers=[], _treasures=[])
    {
        this.points = _points;
        this.directions = _directions;
        this.isFinished = _isFinished;
        this.removedBarriers = _removedBarriers;
        this.treasures = _treasures;
    }

    get directionsLength() {
        return this.directions.length;
    }

    get pathWeight(){
        return (this.treasures.reduce((t1, t2) => {
            let t1Points = t1 ? t1.pointsPrice : 0;
            let t2Points = t2 ? t2.pointsPrice : 0;
            
            return t1Points + t2Points;
        }, 0)  / this.directionsLength); 
    }
}

module.exports.CliffordPath = CliffordPath;