const Element = require('../elements');

class Treasure {
    point = {};
    element = Element.NONE;
    pointsPrice = 0;

    constructor(_price, _element, _point){
        this.point = _point;
        this.element = _element;
        this.pointsPrice = _price;
    }

    set price(_price){
        this.pointsPrice = _price;
    }

    get price(){
        return this.pointsPrice;
    }
}

module.exports = { Treasure };