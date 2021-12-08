const { CliffordPath } = require("./../bs/path");
const Point = require("./../../../engine/point.js");
const { Treasure } = require("../bs/treasure");
const Element = require("../elements.js");
const { assertEquals } = require("./basetests.js");

const tests = () => {
    testPathWeight();
}

const testPathWeight = () => {
    let path1 = new CliffordPath([new Point(0,0), new Point(1,1)], ["left", "right"], true, [], [new Treasure(2, Element.CLUE_GLOVE, new Point(1,1))]);

    assertEquals(path1.pathWeight, 1);
}


module.exports = tests;