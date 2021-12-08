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

const Games = require('./../../engine/games.js');
const Point = require('./../../engine/point.js');
const Direction = Games.require('./direction.js');
const Element = Games.require('./elements.js');
const Stuff = require('./../../engine/stuff.js');
const { MovementManager } = require("./bs/movementmanager");
const { getEnemyLeftDistance, getEnemyRightDistance,
  decreaseBulletCounter, setBulletCounter,
  digHoleIfNeeded } = require("./bs/enemydefender");
const board = require('../../engine/board.js');



var CliffordSolver = module.exports = {
  get: function (board) {
    const movementmanager = new MovementManager(board);
    return movementmanager.getTheNextMove(board);
  },
}
