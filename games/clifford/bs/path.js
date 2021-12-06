class CliffordPath {
    points = [];
    directions = [];
    removedBarriers = [];
    isTreasureFound = false;
    isFinished = false;
    pathLength = 0;

    constructor(_points, _directions, _pathLength = 0, _isFinished=false, _isTreasureFound=false, _removedBarriers=[])
    {
        this.points = _points;
        this.directions = _directions;
        this.isFinished = _isFinished;
        this.isTreasureFound = _isTreasureFound;
        this.removedBarriers = _removedBarriers;
        this.pathLength = _pathLength;
    }

    get directionsLength() {
        return this.directions.length;
    }
}

module.exports.CliffordPath = CliffordPath;