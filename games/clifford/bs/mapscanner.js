class MapScanner {
    constructor(_board, _isPotionActive = false, _keys = []){
        this.board = _board;
        this.barriers_cached = this.board.getBarriers(_isPotionActive, _keys);
        this.map = [,];
        this.visitedPoints = [];
    }

    scanMap = (board, startPosition, pointsToFind) => {
        this.scanPosition(board, startPosition, pointsToFind, 0);
    }

    scanPosition = (board, startPosition, initialWeight) => {
        //right
        
        //left
        //up
        //down
        //shootrightdown
        //shootleftdown
        //shootright
        //shootleft

        this.visitedPoints.push(startPosition);
    }
}

module.exports = { MapScanner }