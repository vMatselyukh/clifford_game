/*-
 * #%L
 * Codenjoy - it's a dojo-like platform from developers to developers.
 * %%
 * Copyright (C) 2021 Codenjoy
 * %%
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public
 * License along with this program.  If not, see
 * <http://www.gnu.org/licenses/gpl-3.0.html>.
 * #L%
 */

var IcancodeBoard = module.exports = function(boardString){

    var Games = require('./../../engine/games.js');
    var Direction = Games.require('./direction.js');
    var Point = require('./../../engine/point.js');
    var util = require('util');
    var Stuff = require('./../../engine/stuff.js');
    var Element = Games.require('./elements.js');
    var LengthToXY = require('./../../engine/lxy.js');

    var LAYER1 = 0;
    var LAYER2 = 1;
    var LAYER3 = 2;

    var board = JSON.parse(boardString);

    var temp = {};
    temp.layers = [];
    temp.layers[0] =
    '                    ' +
    '┐      ╔═════════┐  ' +
    '│      ║˃.....$..│  ' +
    '│      ║....Z....│ ╔' +
    '│      ║.........│ ║' +
    '│  ╔═══╝˃...$...O│ ║' +
    '╚══╝......O..S...│ ║' +
    '.....┌─╗....$..OO│ ║' +
    '┌────┘ ║.O.......│ ║' +
    '│      ║.........╚═╝' +
    '┘ ╔════╝...OO.......' +
    '  ║..$..............' +
    '  ║$..┌─╗...┌─────╗.' +
    '  ║...│ ║...│     ║O' +
    '  └───┘ ║...│     ║.' +
    '┐       ║...│  ╔══╝.' +
    '│  ╔════╝...│  ║....' +
    '│  ║........╚══╝....' +
    '╚══╝O...O...$....┌──' +
    '...........O┌────┘  ';

    temp.layers[1] =
    '--------------------' +
    '--------------------' +
    '---------→------→---' +
    '--------------------' +
    '-----------B-BBBB---' +
    '---------→------→---' +
    '--------♂------☺----' +
    '--------------------' +
    '--------------------' +
    '--------------------' +
    '----------B---------' +
    '--------B-B----B-B--' +
    '----------B--------B' +
    '---------BB---------' +
    '--------------------' +
    '----------B---------' +
    '----------BB--------' +
    '----B------------BB-' +
    '----------------♀---' +
    '--------------------';

    temp.layers[2] =
    '--------------------' +
    '--------------------' +
    '--------------------' +
    '--------------------' +
    '--------------------' +
    '--------------------' +
    '--------------------' +
    '--------------------' +
    '--------------------' +
    '--------------------' +
    '--------------------' +
    '--------------------' +
    '--------------------' +
    '--------------------' +
    '--------------------' +
    '--------------------' +
    '--------------------' +
    '--------------------' +
    '--------------------' +
    '--------------------';

    var layersString = board.layers;
    var scannerOffset = board.offset;
    var heroPosition = board.heroPosition;
    var levelFinished = board.levelFinished;
    var size = Math.sqrt(layersString[LAYER1].length);
    var xyl = new LengthToXY(size);

    var parseLayer = function (layer) {
        var map = [];
        for (var x = 0; x < size; x++) {
            map[x] = [];
            for (var y = 0; y < size; y++) {
                map[x][y] = Element.getElement(layer.charAt(xyl.getLength(x, y)))
            }
        }
        return map;
    }

    var layers = [];
    for (var index in layersString) {
        layers.push(parseLayer(layersString[index]));
    }

    // TODO to add List<Elements> getNear(int numLayer, int x, int y) method

    var isAt = function (layer, x, y, elements) {
        if (!Array.isArray(elements)) {
            var arr = [];
            arr.push(elements);
            elements = arr;
        }

        if (new Point(x, y).isOutOf(size) || getAt(layer, x, y) == null) {
            return false;
        }

        for (var e in elements) {
            var element = elements[e];
            if (getAt(layer, x, y).char == element.char) {
                return true;
            }
        }
        return false;
    };

    var getAt = function (layer, x, y) {
        return layers[layer][x][y];
    };

    var removeAllElements = function(array, element) {
        var index;
        while ((index = array.indexOf(element)) !== -1) {
            array.splice(index, 1);
        }
        return array;
    }

    var getWholeBoard = function() {
        var result = [];
        for (var x = 0; x < size; x++) {
            var arr = [];
            result.push(arr);
            for (var y = 0; y < size; y++) {
                var cell = [];
                cell.push(getAt(LAYER1, x, y).type);
                cell.push(getAt(LAYER2, x, y).type);
                cell.push(getAt(LAYER3, x, y).type);
                removeAllElements(cell, 'NONE');
                if (cell.length == 0) {
                    cell.push('NONE');
                }

                arr.push(cell);
            }
        }
        return result;
    }

    var get = function (layer, elements) {
        if (!Array.isArray(elements)) {
            var arr = [];
            arr.push(elements);
            elements = arr;
        }
        var result = [];
        for (var x = 0; x < size; x++) {
            for (var y = 0; y < size; y++) {
                for (var e in elements) {
                    var element = elements[e];
                    if (isAt(layer, x, y, element)) {
                        result.push(element.direction ? new Point(x, y, element.direction.toString()) : new Point(x, y));
                    }
                }
            }
        }
        return result;
    };

    var isAnyOfAt = function (layer, x, y, elements) {
        for (var index in elements) {
            var element = elements[index];
            if (isAt(x, y, layer, element)) {
                return true;
            }
        }
        return false;
    };

    var isNear = function (layer, x, y, element) {
        if (new Point(x, y).isOutOf(size)) {
            return false;
        }
        return isAt(layer, x + 1, y, element) || isAt(layer, x - 1, y, element)
            || isAt(layer, x, y + 1, element) || isAt(layer, x, y - 1, element);
    };

    var isBarrierAt = function (x, y) {
        if (new Point(x, y).isOutOf(size)) {
            return true;
        }

        if (!barriersMap) {
            getBarriers();
        }
        return barriersMap[x][y];
    };

    var isWallAt = function (x, y) {
        return getAt(LAYER1, x, y).type == 'WALL';
    };

    var countNear = function (layer, x, y, element) {
        if (new Point(x, y).isOutOf(size)) {
            return 0;
        }
        var count = 0;
        if (isAt(layer, x - 1, y, element)) count++;
        if (isAt(layer, x + 1, y, element)) count++;
        if (isAt(layer, x, y - 1, element)) count++;
        if (isAt(layer, x, y + 1, element)) count++;
        return count;
    };

    var getOtherHeroes = function () {
        var elements = [Element.ROBO_OTHER, Element.ROBO_OTHER_FALLING, Element.ROBO_OTHER_LASER];
        return get(LAYER2, elements)
            .concat(get(LAYER3, Element.ROBO_OTHER_FLYING));
    };

    var getLaserMachines = function () {
        var elements = [Element.LASER_MACHINE_CHARGING_LEFT, Element.LASER_MACHINE_CHARGING_RIGHT,
            Element.LASER_MACHINE_CHARGING_UP, Element.LASER_MACHINE_CHARGING_DOWN,
            Element.LASER_MACHINE_READY_LEFT, Element.LASER_MACHINE_READY_RIGHT,
            Element.LASER_MACHINE_READY_UP, Element.LASER_MACHINE_READY_DOWN];
        return get(LAYER1, elements);
    };

    var getLasers = function () {
        var elements = [Element.LASER_LEFT, Element.LASER_RIGHT,
            Element.LASER_UP, Element.LASER_DOWN];
        return get(LAYER2, elements);
    };

    var getWalls = function () {
        var elements = [Element.ANGLE_IN_LEFT, Element.WALL_FRONT,
            Element.ANGLE_IN_RIGHT, Element.WALL_RIGHT,
            Element.ANGLE_BACK_RIGHT, Element.WALL_BACK,
            Element.ANGLE_BACK_LEFT, Element.WALL_LEFT,
            Element.WALL_BACK_ANGLE_LEFT, Element.WALL_BACK_ANGLE_RIGHT,
            Element.ANGLE_OUT_RIGHT, Element.ANGLE_OUT_LEFT,
            Element.SPACE];
        return get(LAYER1, elements);
    };

    var getBoxes = function () {
        return get(LAYER2, Element.BOX);
    };

    var getStarts = function () {
        return get(LAYER1, Element.START);
    };

    var getZombieStart = function () {
        return get(LAYER1, Element.ZOMBIE_START);
    };

    var getExits = function () {
        return get(LAYER1, Element.EXIT);
    };

    var getGold = function () {
        return get(LAYER1, Element.GOLD);
    };

    var getZombies = function () {
        var elements = [Element.FEMALE_ZOMBIE, Element.MALE_ZOMBIE,
            Element.ZOMBIE_DIE];
        return get(LAYER2, elements);
    };

    var getPerks = function () {
        var elements = [
            Element.UNSTOPPABLE_LASER_PERK,
            Element.DEATH_RAY_PERK,
            Element.UNLIMITED_FIRE_PERK,
            Element.FIRE_PERK,
            Element.JUMP_PERK,
            Element.MOVE_BOXES_PERK
        ];
        return get(LAYER1, elements);
    }

    var getHoles = function () {
        return get(LAYER1, Element.HOLE);
    };

    var isMeAlive = function () {
        return layersString[LAYER2].indexOf(Element.ROBO_LASER.char) == -1 &&
            layersString[LAYER2].indexOf(Element.ROBO_FALLING.char) == -1;
    };

    var barriers = null;
    var barriersMap = null;
    var getBarriers = function () {
        if (!!barriers) {
            return barriers;
        }

        barriers = [];
        barriersMap = Array(size);
        for (var x = 0; x < size; x++) {
            barriersMap[x] = new Array(size);
            for (var y = 0; y < size; y++) {
                var element1 = getAt(LAYER1, x, y);
                var element2 = getAt(LAYER2, x, y);

                barriersMap[x][y] = (
                    element1.type == 'WALL' ||
                    element1 == Element.HOLE ||
                    element2 == Element.BOX ||
                    !!element1.direction
                );

                if (barriersMap[x][y]) {
                    barriers.push(new Point(x, y));
                }
            }
        }
        return barriers;
    };

    var getFromArray = function(x, y, array, def) {
        if (x < 0 || y < 0 || x >= size || y >= size) {
            return def;
        }
        return array[x][y];
    }

    var isBarrier = function(x, y) {
        return getFromArray(x, y, barriersMap, true);
    }

    var getShortestWay = function (from, to) {
        if (from.getX() == to.getX() && from.getY() == to.getY()) {
            return [from];
        }
        if (!barriersMap) {
            getBarriers();
        }

        var mask = Array(size);
        for (var x = 0; x < size; x++) {
            mask[x] = new Array(size);
            for (var y = 0; y < size; y++) {
                mask[x][y] = (isWallAt(x, y)) ? -1 : 0;
            }
        }

        var getMask = function(x, y) {
            return getFromArray(x, y, mask, -1);
        }

        var current = 1;
        mask[from.getX()][from.getY()] = current;

        var isOutOf = function (x, y) {
            return (x < 0 || y < 0 || x >= size || y >= size);
        }

        var comeRound = function (x, y, onElement) {
            var dd = [[-1, 0], [1, 0], [0, -1], [0, 1]];
            for (var i in dd) {
                var dx = dd[i][0];
                var dy = dd[i][1];

                var xx = x + dx;
                var yy = y + dy;
                if (isOutOf(xx, yy)) continue;

                var stop = !onElement(xx, yy);

                if (stop) return;
            }
        }

        var done = false;
        while (!done) {
            var maskToString = function() {
                var string = '01234567890123456789\n';
                for (var y = 0; y < size; y++) {
                    for (var x = 0; x < size; x++) {
                        if (mask[x][y] == -1) {
                            var s = '*';
                        } else if (mask[x][y] == 0) {
                            if (getAt(x, y, LAYER1) == Element.HOLE) {
                                var s = 'O';
                            } else if (getAt(x, y, LAYER2) == Element.BOX) {
                                var s = 'B';
                            } else if (getAt(x, y, LAYER1) == Element.EXIT) {
                                var s = 'E';
                            } else {
                                var s = ' ';
                            }
                        } else {
                            var s = '' + mask[x][y];
                        }
                        if (s.length == 2) s = s[1];
                        string += s;
                    }
                    string += ' ' + y + '\n';
                }
                string += '01234567890123456789\n';
                console.log(string);
            }
            // s = 8;
            // if (s == -1 || current >= s - 1 && current <= s) maskToString();

            for (var x = 0; x < size; x++) {
                for (var y = 0; y < size; y++) {
                    if (mask[x][y] != current) continue;

                    comeRound(x, y, function (xx, yy) {
                        if (getMask(xx, yy) == 0) {
                            var dx = xx - x;
                            var dy = yy - y;

                            var px = x - dx;
                            var py = y - dy;

                            var fx = xx + dx;
                            var fy = yy + dy;

                            // путь px/py -> x/y -> xx/yy -> fx/fy

                            var can = true;
                            if (isBarrier(xx, yy) && isBarrier(fx, fy)) {
                                can = false;
                            }
                            if (isBarrier(x, y)) {
                                if (getMask(px, py) == -1) {
                                    can = false;
                                }
                                if (isBarrier(xx, yy)) {
                                    can = false;
                                }
                            }
                            // if (s == -1 || current >= s - 1 && current < s) {
                            //     console.log('px/py: ' + px + ' ' + py);
                            //     console.log('x/y: ' + x + ' ' + y);
                            //     console.log('xx/yy: ' + xx + ' ' + yy);
                            //     console.log('fx/fy: ' + fx + ' ' + fy);
                            //     console.log('mask[px][py]: ' + mask[px][py]);
                            //     console.log('isBarrier(px, py): ' + isBarrier(px, py));
                            //     console.log('isBarrier(x, y): ' + isBarrier(x, y));
                            //     console.log('isBarrier(xx, yy): ' + isBarrier(xx, yy));
                            //     console.log('isBarrier(fx, fy): ' + isBarrier(fx, fy));
                            //     console.log(((can) ? '+' : '-') + (current + 1) + ": [" + x + ":" + y + "] -> [" + xx + ":" + yy + "]");
                            // }

                            if (can) {
                                mask[xx][yy] = current + 1;
                                if (xx == to.getX() && yy == to.getY()) {
                                    done = true;
                                }
                            }
                        }
                        return true;
                    });
                }
            }

            current++;
            if (current > 200) {
                return [];
            }
        }
        var point = to;
        done = false;
        current = mask[point.getX()][point.getY()];
        var path = [];
        path.push(point);
        while (!done) {
            comeRound(point.getX(), point.getY(), function (xx, yy) {
                if (mask[xx][yy] == current - 1) {
                    point = new Point(xx, yy);
                    current--;

                    path.push(point);

                    if (current == 1) {
                        done = true;
                    }
                    return false;
                }
                return true;
            });
        }

        return path.reverse();
    }

    var boardAsString = function(layer) {
        var result = "";
        for (var i = 0; i <= size - 1; i++) {
            result += layersString[layer].substring(i * size, (i + 1) * size);
            result += "\n";
        }
        return result;
    };

    var getMe = function() {
        return new Point(heroPosition.x, heroPosition.y);
    }

    // thanks http://jsfiddle.net/queryj/g109jvxd/
    String.format = function () {
        // The string containing the format items (e.g. "{0}")
        // will and always has to be the first argument.
        var theString = arguments[0];

        // start with the second argument (i = 1)
        for (var i = 1; i < arguments.length; i++) {
            // "gm" = RegEx options for Global search (more than one instance)
            // and for Multiline search
            var regEx = new RegExp("\\{" + (i - 1) + "\\}", "gm");
            theString = theString.replace(regEx, arguments[i]);
        }
    }

    var setCharAt = function(str, index, replacement) {
        return str.substr(0, index) + replacement + str.substr(index + replacement.length);
    }

    var maskOverlay = function(source, mask) {
        var result = source;
        for (var i = 0; i < result.length; ++i) {
            var el = Element.getElement(mask[i]);
            if (Element.isWall(el)) {
                result = setCharAt(result, i, el.char);
            }
        }

        return result.toString();
    }

    var toString = function () {
        var temp = '0123456789012345678901234567890';

        var result = '';

        var layer1 = boardAsString(LAYER1).split('\n').slice(0, -1);
        var layer2 = boardAsString(LAYER2).split('\n').slice(0, -1);
        var layer3 = boardAsString(LAYER3).split('\n').slice(0, -1);

        var numbers = temp.substring(0, layer1.length);
        var space = ''.padStart(layer1.length - 5);
        var numbersLine = numbers + '   ' + numbers + '   ' + numbers;
        var firstPart = ' Layer1 ' + space + ' Layer2' + space + ' Layer3' + '\n  ' + numbersLine;

        for (var i = 0; i < layer1.length; ++i) {
            var ii = size - 1 - i;
            var index = (ii < 10 ? ' ' : '') + ii;
            result += index + layer1[i] +
                ' ' + index + maskOverlay(layer2[i], layer1[i]) +
                ' ' + index + maskOverlay(layer3[i], layer1[i]);

            switch (i) {
                case 0:
                    result += ' Robots: ' + getMe() + ',' + Stuff.printArray(getOtherHeroes());
                    break;
                case 1:
                    result += ' Gold: ' + Stuff.printArray(getGold());
                    break;
                case 2:
                    result += ' Starts: ' + Stuff.printArray(getStarts());
                    break;
                case 3:
                    result += ' Exits: ' + Stuff.printArray(getExits());
                    break;
                case 4:
                    result += ' Boxes: ' + Stuff.printArray(getBoxes());
                    break;
                case 5:
                    result += ' Holes: ' + Stuff.printArray(getHoles());
                    break;
                case 6:
                    result += ' LaserMachine: ' + Stuff.printArray(getLaserMachines());
                    break;
                case 7:
                    result += ' Lasers: ' + Stuff.printArray(getLasers());
                    break;
                case 8:
                    result += ' Zombies: ' + Stuff.printArray(getZombies());
                    break;
                case 9:
                    result += ' Perks: ' + printArray(getPerks());
                    break;
            }

            if (i != layer1.length - 1) {
                result += '\n';
            }
        }

        return firstPart + '\n' + result + '\n  ' + numbersLine;
    };

    return {
        LAYER1 : LAYER1,
        LAYER2 : LAYER2,
        LAYER3 : LAYER3,
        size: function () {
            return size;
        },
        getMe: getMe,
        isLevelFinished: function() {
            return levelFinished;
        },
        getOtherHeroes: getOtherHeroes,
        getLaserMachines: getLaserMachines,
        getLasers: getLasers,
        getWalls: getWalls,
        getBoxes: getBoxes,
        getGold: getGold,
        getStarts: getStarts,
        getZombies: getZombies,
        getZombieStart: getZombieStart,
        getPerks: getPerks,
        getExits: getExits,
        getHoles: getHoles,
        isMeAlive: isMeAlive,
        isAt: isAt,
        getAt: getAt,
        get: get,
        toString: toString,
        boardAsString: function () {
            return board;
        },
        layer1: function () {
            return boardAsString(LAYER1)
        },
        layer2: function () {
            return boardAsString(LAYER2)
        },
        layer3: function () {
            return boardAsString(LAYER3)
        },
        getWholeBoard: getWholeBoard,
        getBarriers: getBarriers,
        isAnyOfAt: isAnyOfAt,
        isNear: isNear,
        isBarrierAt: isBarrierAt,
        countNear: countNear,
        getShortestWay: getShortestWay,
        getScannerOffset: function () {
            return new Point(scannerOffset.x, scannerOffset.y);
        }
    };
};