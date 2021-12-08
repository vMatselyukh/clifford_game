const { MovementManager } = require("../bs/movementmanager");
var Games = require('./../../../engine/games.js');
var Direction = Games.require('../direction.js');
var Board = Games.require('../board.js');
const { assertEquals } = require("./basetests.js");

module.exports = () => {
    testMovementManagerWorks();
    testMovementManagerWorks1();
}

const testMovementManagerWorks = () => {
    let board = new Board(
        "☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼" +
        "☼H   @&  @  &&~~H~~~~☼☼☼☼☼☼☼H☼" +
        "☼H~~~~  ######  H         H☼H☼" +
        "☼H              ##H#######H☼H☼" +
        "☼H#########       H    ~~~H☼H☼" +
        "☼H      $ ###H####H##H◄    ☼H☼" +
        "☼H           H    x #######☼H☼" +
        "☼~~~~~~~~~~~~H  &  & H~~~~~☼H☼" +
        "☼ @&  H          &»  H     ☼H☼" +
        "☼ ### #############H H#####☼H☼" +
        "☼H                 H    &  ☼H☼" +
        "☼H#####      &$ H##H####   &H☼" +
        "☼H      H######### H @ ######☼" +
        "☼H##$  WH  (    & &H~~~~~~   ☼" +
        "☼~~~~#####H#   ~~~~H$  $     ☼" +
        "☼    m    H        H  $&  ~~~☼" +
        "☼   ########H    ######H##   ☼" +
        "☼           H         $H     ☼" +
        "☼H &  ###########H   m H#####☼" +
        "☼H### @     & W  H&  W H $   ☼" +
        "☼H  ######  ##H###### »H     ☼" +
        "☼H W          H ~~~~~##H###H&☼" +
        "☼   »X########H#   &   H   ##☼" +
        "☼ ###H   $ $  H         ~~~~~☼" +
        "☼    H########H#########    m☼" +
        "☼H   H                      &☼" +
        "☼H  ####H######         #####☼" +
        "☼H      H W    H#######H     ☼" +
        "☼##############H       H#####☼" +
        "☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼"
    );

    const movementManager = new MovementManager(board);

    const nextDirection = movementManager.getTheNextMove();

    assertEquals(Direction.CRACK_RIGHT, nextDirection);
}

const testMovementManagerWorks1 = () => {
    let board = new Board(
        "☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼" +
        "☼~~~~~~~~~~           ~~~~~~~☼" +
        "☼HH  W    H##########H  &    ☼" +
        "☼######H  H          H#☼☼☼☼☼#☼" +
        "☼ $    H#####H#####H##$ ~~~~~☼" +
        "☼      H ~   HW    H  ~~     ☼" +
        "☼#####H#     H   $ H    ~~   ☼" +
        "☼   & H   H######H##      ~~&☼" +
        "☼     H~~~H      H &    $   #☼" +
        "☼     H      H#########H     ☼" +
        "☼    H##     H#$$     ##   $ ☼" +
        "☼H###H######### H###H #####H#☼" +
        "☼H   H          H# #H      H ☼" +
        "☼H#######   ###### ##########☼" +
        "☼H         $ @             & ☼" +
        "☼H#######~~~####H############☼" +
        "☼H              H        m   ☼" +
        "☼##H~~~~      ############H  ☼" +
        "☼  H           m   & &&&W H &☼" +
        "☼########~~~~~~~H######## Hm$☼" +
        "☼               H         H& ☼" +
        "☼~~~~& ~~~#########~~~~~  H  ☼" +
        "☼H$ «)               W~~~~H&&☼" +
        "☼##☼☼☼☼☼☼# & ☼☼☼☼☼☼☼@ &  &H &☼" +
        "☼~~      ~~~              H &☼" +
        "☼  H#####   ########### & H@ ☼" +
        "☼  H  ◄    x~~~~~~~~~~~~~~H@ ☼" +
        "☼  H#y##H               W H@ ☼" +
        "☼☼☼☼☼☼☼☼☼######☼☼☼☼☼☼☼#######☼" +
        "☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼"
    );

    const movementManager = new MovementManager(board);

    const nextDirection = movementManager.getTheNextMove();

    //assertEquals(Direction.CRACK_RIGHT, nextDirection);
}

