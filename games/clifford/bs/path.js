class CliffordPath {
    points = [];
    directions = [];
    removedBarriers = [];
    isTheFirst = false;
    isFinished = false;

    constructor(_points, _directions, _isFinished=false, _isTheFirstShortest=false, _removedBarriers=[])
    {
        this.points = _points;
        this.directions = _directions;
        this.isFinished = _isFinished;
        this.isTheFirstShortest = _isTheFirstShortest;
        this.removedBarriers = _removedBarriers;
    }
}

module.exports.CliffordPath = CliffordPath;