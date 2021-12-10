//►
//◄
//& glove
//$ knife
//@ ring

const { MovementManager } = require("../bs/movementmanager");
const { CliffordPath } = require("../bs/path.js");
const { assertEquals } = require("./basetests.js");
var Games = require('./../../../engine/games.js');
var Board = Games.require('../board.js');
var Direction = Games.require('../direction.js');
const Point = require('./../../../engine/point.js');
const { digHoleIfNeeded, getEnemyLeftShot, setBulletCounter } = require("../bs/enemydefender");
const { getTreasuresOnBoard, getTheNextPoint, getTheBestPath } = require("../bs/pathfinder");
const { Shot } = require("../bs/shot");

const PathFinderTests = () => {
    testGetTreasuresOnBoard();
    // testGetTheNextPoint();
    // testGetTheNextPointAbovePipe();
    testFindPathFromPoint();
    testFindPathFromPipe();
    testFindPathFromBlocked();
    testFindPathFromBlocked1();
    testFindPathFromBlocked2();
    testFindPathFromBlocked3();
    testFindPathFromBlocked4();
    testFindPathFromBlocked5();
    testFindPathFromBlocked6();
    testDigHole();
    testGetEnemyLeftDistance();
    testSetBulletCounter();
    testBug1();
    testTheMostEfficientPath();
    testTheCircularPath();
}

const testGetTreasuresOnBoard = () => {
    let board = new Board(
        "☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼" +
        "☼H$  &   $ @&&~~H~~~~☼☼☼☼☼☼☼H☼" +
        "☼H~~~~  ######  H        &H☼H☼" +
        "☼H»     &  &&&  ##H#######H☼H☼" +
        "☼H#########     & H»  &~~~H☼H☼" +
        "☼H&$ &&@&&###H####H##H     ☼H☼" +
        "☼H $ &$   && H    & #######☼H☼" +
        "☼~~~~~~~~~~~~H    @  H~~~~~☼H☼" +
        "☼     H   & $        H@ & »☼H☼" +
        "☼ ### #############H H#####☼H☼" +
        "☼H       $ & $&    H      &☼H☼" +
        "☼H#####         H##H####() (H☼" +
        "☼H @ $$ H######### H   ######☼" +
        "☼H##    H◄       & H~~~~~~@&&☼" +
        "☼~~~~#####H#   ~~~~X   @@    ☼" +
        "☼         H    $   H  m   ~~~☼" +
        "☼   ########H  & ######H##$  ☼" +
        "☼       B   H          H     ☼" +
        "☼H    ###########H    $H#####☼" +
        "☼H###            H     H&&$&$☼" +
        "☼H& ######  ##H######» H     ☼" +
        "☼H     (      H ~~~~~##H###H ☼" +
        "☼    H########H#   $&  H&&&##☼" +
        "☼ ###H        H   +     ~~~~~☼" +
        "☼  $&H########H#########$    ☼" +
        "☼H   H    &    $ &$@         ☼" +
        "☼H  ####H######         #####☼" +
        "☼H      H      H#######H@   &☼" +
        "☼##############H       H#####☼" +
        "☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼"
    );

    assertEquals("[9,16]", board.getHero());

    assertEquals("[15,4],[18,4],[3,5],[24,5],[19,7],[26,10],[28,10],[22,11],[26,13]," +
        "[15,14],[5,17],[6,17],[9,19],[13,19],[12,21],[3,23],[6,23],[3,24]," +
        "[2,28],[9,28],[28,2],[10,4],[17,4],[4,5],[20,7],[24,7],[25,7],[26,7]," +
        "[2,9],[24,10],[25,10],[27,10],[15,13],[17,16],[27,16],[28,16],[11,19]," +
        "[14,19],[26,19],[10,21],[24,21],[5,23],[10,23],[11,23],[18,23],[2,24]," +
        "[5,24],[6,24],[8,24],[9,24],[16,25],[22,25],[8,26],[11,26],[12,26],[13,26]," +
        "[25,27],[5,28],[12,28],[13,28],[24,2],[19,4],[23,15],[24,15],[26,16],[3,17]," +
        "[22,21],[18,22],[7,24],[11,28]," +
        `[22,14],` +
        `[18,6]`, getTreasuresOnBoard(board));
}

// const testGetTheNextPoint = () => {
//     let board = new Board(
//         "☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼" +
//         "☼H$  &   $ @&&~~H~~~~☼☼☼☼☼☼☼H☼" +
//         "☼H~~~~  ######  H        &H☼H☼" +
//         "☼H»     &  &&&  ##H#######H☼H☼" +
//         "☼H#########     & H»  &~~~H☼H☼" +
//         "☼H&$ &&@&&###H####H##H     ☼H☼" +
//         "☼H $ &$   && H    & #######☼H☼" +
//         "☼~~~~~~~~~~~~H    @  H~~~~~☼H☼" +
//         "☼     H   & $        H@ & »☼H☼" +
//         "☼ ### #############H H#####☼H☼" +
//         "☼H       $ & $&    H      &☼H☼" +
//         "☼H#####         H##H####() (H☼" +
//         "☼H @ $$ H######### H   ######☼" +
//         "☼H##    H   ►    & H~~~~~~@&&☼" +
//         "☼~~~~#####H#   ~~~~X   @@    ☼" +
//         "☼         H    $   H  m   ~~~☼" +
//         "☼   ########H  & ######H##$  ☼" +
//         "☼       B   H          H     ☼" +
//         "☼H    ###########H    $H#####☼" +
//         "☼H###            H     H&&$&$☼" +
//         "☼H& ######  ##H######» H     ☼" +
//         "☼H     (      H ~~~~~##H###H ☼" +
//         "☼    H########H#   $&  H&&&##☼" +
//         "☼ ###H        H   +     ~~~~~☼" +
//         "☼  $&H########H#########$    ☼" +
//         "☼H   H    &    $ &$@         ☼" +
//         "☼H  ####H######         #####☼" +
//         "☼H      H      H#######H@   &☼" +
//         "☼##############H       H#####☼" +
//         "☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼"
//     );

//     const heroPoint = board.getHero();
//     const ground_cached = [...board.getWalls(), ...board.getLadders()];
//     const pipes_cached = board.getPipes();
//     const startPath = new CliffordPath([heroPoint],[Direction.STOP], false)
//     const theNextPoint = getTheNextPoint(board, startPath, heroPoint, ground_cached, pipes_cached);

//     assertEquals(new Point(heroPoint.x, heroPoint.y - 1), theNextPoint);
// }

// const testGetTheNextPointAbovePipe = () => {
//     let board = new Board(
//         "☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼" +
//         "☼H$  &   $ @&&~~H~~~~☼☼☼☼☼☼☼H☼" +
//         "☼H~~~~  ######  H        &H☼H☼" +
//         "☼H»     &  &&&  ##H#######H☼H☼" +
//         "☼H#########     & H»  &~~~H☼H☼" +
//         "☼H&$ &&@&&###H####H##H     ☼H☼" +
//         "☼H $ &$   && H    & #######☼H☼" +
//         "☼~~~~~~~~~~~~H    @  H~~~~~☼H☼" +
//         "☼     H   & $        H@ & »☼H☼" +
//         "☼ ### #############H H#####☼H☼" +
//         "☼H       $ & $&    H      &☼H☼" +
//         "☼H#####         H##H# ##() (H☼" +
//         "☼H @ $$ H######### H ► ######☼" +
//         "☼H##    H        & H~~~~~~@&&☼" +
//         "☼~~~~#####H#   ~~~~X   @@    ☼" +
//         "☼         H    $   H  m   ~~~☼" +
//         "☼   ########H  & ######H##$  ☼" +
//         "☼       B   H          H     ☼" +
//         "☼H    ###########H    $H#####☼" +
//         "☼H###            H     H&&$&$☼" +
//         "☼H& ######  ##H######» H     ☼" +
//         "☼H     (      H ~~~~~##H###H ☼" +
//         "☼    H########H#   $&  H&&&##☼" +
//         "☼ ###H        H   +     ~~~~~☼" +
//         "☼  $&H########H#########$    ☼" +
//         "☼H   H    &    $ &$@         ☼" +
//         "☼H  ####H######         #####☼" +
//         "☼H      H      H#######H@   &☼" +
//         "☼##############H       H#####☼" +
//         "☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼"
//     );

//     const heroPoint = board.getHero();
//     const ground_cached = [...board.getWalls(), ...board.getLadders()];
//     const pipes_cached = board.getPipes();
//     const startPath = new CliffordPath([heroPoint],[Direction.STOP], false)
//     const theNextPoint = getTheNextPoint(board, startPath, heroPoint, ground_cached, pipes_cached);

//     assertEquals(new Point(heroPoint.x, heroPoint.y - 1), theNextPoint);
// }

const testFindPathFromPoint = () => {
    let board = new Board(
        "☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼" +
        "☼H$  &   $ @&&~~H~~~~☼☼☼☼☼☼☼H☼" +
        "☼H~~~~  ######  H        &H☼H☼" +
        "☼H»     &  &&&  ##H#######H☼H☼" +
        "☼H#########     & H»  &~~~H☼H☼" +
        "☼H&$ &&@&&###H####H##H     ☼H☼" +
        "☼H $ &$   && H    & #######☼H☼" +
        "☼~~~~~~~~~~~~H    @  H~~~~~☼H☼" +
        "☼     H   & $        H@ & »☼H☼" +
        "☼ ### #############H H#####☼H☼" +
        "☼H       $ & $&    H      &☼H☼" +
        "☼H#####         H##H####() (H☼" +
        "☼H @ $$ H######### H   ######☼" +
        "☼H##    H        & H~~~~~~@&&☼" +
        "☼~~~~#####H#   ~~~~X   @@    ☼" +
        "☼         H    $   H  m   ~~~☼" +
        "☼   ########H  & ######H##$  ☼" +
        "☼       B   H          H     ☼" +
        "☼H    ###########H    $H#####☼" +
        "☼H###            H►    H&&$&$☼" +
        "☼H& ######  ##H######» H     ☼" +
        "☼H     (      H ~~~~~##H###H ☼" +
        "☼    H########H#   $&  H&&&##☼" +
        "☼ ###H        H   +     ~~~~~☼" +
        "☼  $&H########H#########$    ☼" +
        "☼H   H    &    $ &$@         ☼" +
        "☼H  ####H######         #####☼" +
        "☼H      H      H#######H@   &☼" +
        "☼##############H       H#####☼" +
        "☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼"
    );

    const heroPoint = board.getHero();

    const shortestPath = getTheBestPath(board, heroPoint);

    assertEquals(",right,srightdown,right,fallingdown,fallingdown,down,fallingdown,sleftdown,left,fallingdown,fallingdown,fallingdown",
        shortestPath.directions.toString());
}

const testFindPathFromPipe = () => {
    let board = new Board(
        "☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼" +
        "☼H$  &   $ @&&~~H~~~~☼☼☼☼☼☼☼H☼" +
        "☼H~~~~  ######  H        &H☼H☼" +
        "☼H»     &  &&&  ##H#######H☼H☼" +
        "☼H#########     & H»  &~~~H☼H☼" +
        "☼H&$ &&@&&###H####H##H     ☼H☼" +
        "☼H $ &$   && H    & #######☼H☼" +
        "☼~~~~~~~~~~~~H    @  H~~~~~☼H☼" +
        "☼     H   & $        H@ & »☼H☼" +
        "☼ ### #############H H#####☼H☼" +
        "☼H       $ & $&    H      &☼H☼" +
        "☼H#####         H##H####() (H☼" +
        "☼H @ $$ H######### H   ######☼" +
        "☼H##    H        & H~~~~~~@&&☼" +
        "☼~~~~#####H#   ~~~~X   @@   ►☼" +
        "☼         H    $   H  m   ~~~☼" +
        "☼   ########H  & ######H##$  ☼" +
        "☼       B   H          H     ☼" +
        "☼H    ###########H    $H#####☼" +
        "☼H###            H     H&&$&$☼" +
        "☼H& ######  ##H######» H     ☼" +
        "☼H     (      H ~~~~~##H###H ☼" +
        "☼    H########H#   $&  H&&&##☼" +
        "☼ ###H        H   +     ~~~~~☼" +
        "☼  $&H########H#########$    ☼" +
        "☼H   H    &    $ &$@         ☼" +
        "☼H  ####H######         #####☼" +
        "☼H      H      H#######H@   &☼" +
        "☼##############H       H#####☼" +
        "☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼"
    );

    const heroPoint = board.getHero();

    const shortestPath = getTheBestPath(board, heroPoint);

    assertEquals(",fallingdown,left,left,down,fallingdown,sleftdown,left,fallingdown,fallingdown,fallingdown,sleftdown,left,fallingdown,fallingdown,fallingdown,down,fallingdown",
        shortestPath.directions.toString());
}

const testFindPathFromBlocked = () => {
    let board = new Board(
        "☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼" +
        "☼H$  &   $ @&&~~H~~~~☼☼☼☼☼☼☼H☼" +
        "☼H~~~~  ######  H        &H☼H☼" +
        "☼H»     &  &&&  ##H#######H☼H☼" +
        "☼H#########     & H»  &~~~H☼H☼" +
        "☼H&$ &&@&&###H####H##H     ☼H☼" +
        "☼H $ &$   && H    & #######☼H☼" +
        "☼~~~~~~~~~~~~H    @  H~~~~~☼H☼" +
        "☼     H   & $        H@ & »☼H☼" +
        "☼ ### #############H H#####☼H☼" +
        "☼H       $ & $&    H      &☼H☼" +
        "☼H#####         H##H####() (H☼" +
        "☼H @ $$ H######### H   ######☼" +
        "☼H##    H        & H~~~~~~@&&☼" +
        "☼~~~~#####H#   ~~~~X   @@    ☼" +
        "☼         H    $   H  m   ~~~☼" +
        "☼   ########H  & ######H##$  ☼" +
        "☼       B   H          H     ☼" +
        "☼H    ###########H    $H#####☼" +
        "☼H###            H     H&&$&$☼" +
        "☼H& ######  ##H######» H     ☼" +
        "☼H     (      H ~~~~~##H###H ☼" +
        "☼    H########H#   $&  H&&&##☼" +
        "☼ ###H        H   +     ~~~~~☼" +
        "☼  $&H########H#########$    ☼" +
        "☼H   H    &    $ &$@   #  ►  ☼" +
        "☼H  ####H######         #####☼" +
        "☼H      H      H#######H@   &☼" +
        "☼##############H       H#####☼" +
        "☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼"
    );

    const heroPoint = board.getHero();

    const shortestPath = getTheBestPath(board, heroPoint);

    assertEquals(",left,sleftdown,left,fallingdown,fallingdown",
        shortestPath.directions.toString());
}

const testFindPathFromBlocked1 = () => {
    let board = new Board(
        "☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼" +
        "☼H   @&  @  &&~~H~~~~☼☼☼☼☼☼☼H☼" +
        "☼H~~~~  ######  H         H☼H☼" +
        "☼H              ##H#######H☼H☼" +
        "☼H#########       H&   ~~~H☼H☼" +
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

    const heroPoint = board.getHero();

    // for(let i = 0; i < 40;i++){
    //     const shortestPath1 = getTheBestPath(board, heroPoint);    
    // }
    const shortestPath = getTheBestPath(board, heroPoint);

    assertEquals(",left,up,left,left,left,up,up,left,left,up,left,left,left,left,left,left,left",
        shortestPath.directions.toString());
}

const testFindPathFromBlocked2 = () => {
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

    const heroPoint = board.getHero();

    const shortestPath = getTheBestPath(board, heroPoint);

    assertEquals(",left,up,left,left,left,up,up,left,left,up,left,left,left,left,left,left,left",
        shortestPath.directions.toString());
}

const testFindPathFromBlocked3 = () => {
    let board = new Board(
        "☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼" +
        "☼H            ~~HY~~~☼☼☼☼☼☼☼H☼" +
        "☼H~~~~  ######  H    ►    H☼H☼" +
        "☼H@ @   &       ##H#######H☼H☼" +
        "☼H#########       H)   ~~~H☼H☼" +
        "☼H        ###H####H##H     ☼H☼" +
        "☼H $         H   &  #######☼H☼" +
        "☼~~~~~~~~J~~~H     m H~~~~~☼H☼" +
        "☼  &  H   »       »  H     ☼H☼" +
        "☼ ### #############HmH#####☼H☼" +
        "☼H$      &  $      H &     ☼H☼" +
        "☼H#####         H##H#### &  H☼" +
        "☼H    & H######### H & ######☼" +
        "☼H##    H       &  H~~~~~~W  ☼" +
        "☼~~~~#####H#  m~~~~H         ☼" +
        "☼         H     &  H      ~~~☼" +
        "☼   ########H    ######H##$  ☼" +
        "☼         & H      $   H     ☼" +
        "☼H    ###########H    &H#####☼" +
        "☼H###     @&    (H &   HW$   ☼" +
        "☼H  ######& ##H######@$H     ☼" +
        "☼H            H ~~~~~##H###H ☼" +
        "☼    H########H#@      H   ##☼" +
        "☼ ###H     &  H         ~~~~~☼" +
        "☼&   H########H#########    &☼" +
        "☼H&  H$             $     $W ☼" +
        "☼H  ####H######      W  #####☼" +
        "☼H      H      H#######H    &☼" +
        "☼##############H      WH#####☼" +
        "☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼"
    );

    const heroPoint = board.getHero();

    const shortestPath = getTheBestPath(board, heroPoint);

    assertEquals(",left,left,left,left,left,up,left,left,left,left,left,left,left,left,left,fallingdown,fallingdown,left,left,left,sleftdown,left,fallingdown,fallingdown,fallingdown,fallingdown,down,sleftdown,left,fallingdown,fallingdown",
        shortestPath.directions.toString());
}

const testFindPathFromBlocked4 = () => {
    let board = new Board(
        "☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼" +
        "☼                   $  &&    ☼" +
        "☼##H########################H☼" +
        "☼  H      &    &            H☼" +
        "☼H☼☼#☼☼H &  H#########H  W  H☼" +
        "☼H     H    H         H#####H☼" +
        "☼H#☼#☼#H   $H         H  ~~~ ☼" +
        "☼H  ~  H~~~~H~~J~~~)  H      ☼" +
        "☼H$    H    H    ►H###☼☼☼☼☼☼H☼" +
        "☼H   & H    X#####H         H☼" +
        "☼☼###☼##☼##☼H&&       H###H##☼" +
        "☼☼###☼~~~~$ H & m     H   H##☼" +
        "☼☼   ☼  &   H   ~~~~~~H& $H  ☼" +
        "☼########H###☼☼☼☼     H  ####☼" +
        "☼W &     H@$     W    H  @   ☼" +
        "☼H##########################H☼" +
        "☼H    » • • • • W •~~~      H☼" +
        "☼#######H#######            H☼" +
        "☼       H~~~~~~~~~~   $     H☼" +
        "☼       H   $##H   #######H##☼" +
        "☼       X    ##H&   @     H  ☼" +
        "☼##H#####    ########H#######☼" +
        "☼  H       &m    &   H  &    ☼" +
        "☼#########H##########H       ☼" +
        "☼ @ W     H &        H  $    ☼" +
        "☼☼☼    $  H~~~~~~~~~~H       ☼" +
        "☼ @  H######&     &  #######H☼" +
        "☼H☼  H                m   & H☼" +
        "☼##########☼☼☼######☼☼######H☼" +
        "☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼"
    );

    const heroPoint = board.getHero();

    const shortestPath = getTheBestPath(board, heroPoint);

    assertEquals(",left,left,sleftdown,left,fallingdown,fallingdown,fallingdown,fallingdown",
        shortestPath.directions.toString());
}

const testFindPathFromBlocked5 = () => {
    let board = new Board(
        "☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼" +
        "☼~~~~~~~~~~     &     ~~~~~~~☼" +
        "☼HH       H##########H  &    ☼" +
        "☼######H  H   W    $ H#☼☼☼☼☼#☼" +
        "☼      H#####H#####H##  ~~~~~☼" +
        "☼      H&~   H @   H  ~~     ☼" +
        "☼#####H#  )  H     H    ~~ & ☼" +
        "☼     H   H######H##      ~~$☼" +
        "☼ &&$ H~~~H &W   H    @     #☼" +
        "☼     H      H#########H     ☼" +
        "☼   &H##     H#  &    ##   $ ☼" +
        "☼H###H######### H###H #####H#☼" +
        "☼H   H &  $     H# #H      H ☼" +
        "☼H#######   ###### ##########☼" +
        "☼H     »    $   &$         $ ☼" +
        "☼H#######~~~####H############☼" +
        "☼H            @ H»   $ @ @  &☼" +
        "☼##H~~~~      ############H  ☼" +
        "☼  H     & &              H  ☼" +
        "☼########~~~~~~~H######## H  ☼" +
        "☼m    m       & H  W      H  ☼" +
        "☼~~~~ m~~~#########~~~~~  H  ☼" +
        "☼H    &  &     &      ~~~~H  ☼" +
        "☼##☼☼☼☼☼☼#   ☼☼☼☼☼☼☼      H  ☼" +
        "☼~~      ~~~         ►  &$H  ☼" +
        "☼  H#####W  ###########W  X  ☼" +
        "☼  H )      ~~~~~~~~~~~~~~H  ☼" +
        "☼  H####H                 H  ☼" +
        "☼☼☼☼☼☼☼☼☼######☼☼☼☼☼☼☼#######☼" +
        "☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼"
    );

    const heroPoint = board.getHero();

    const shortestPath = getTheBestPath(board, heroPoint);

    assertEquals(",right,right,fallingdown,fallingdown",
        shortestPath.directions.toString());
}

const testFindPathFromBlocked6 = () => {
    let board = new Board(
        "☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼" +
        "☼~~~~~~~~~~   @$$     ~~~~~~~☼" +
        "☼HH  $    H##########H  $m   ☼" +
        "☼######H  H   $      H#☼☼☼☼☼#☼" +
        "☼    @ H#####H#####H##  ~~~~~☼" +
        "☼W   & H ~   H m&  H  ~~    W☼" +
        "☼#####H#     H    @H $ &~~   ☼" +
        "☼  &  H   H######H##     $~~ ☼" +
        "☼     H~~~H &  W H      m   #☼" +
        "☼     H      H#########H     ☼" +
        "☼    H## &   H#       ## (   ☼" +
        "☼H###H######### H###H #####H#☼" +
        "☼H   H          H# #H     ►H ☼" +
        "☼H#######   ###### ##########☼" +
        "☼H          »              & ☼" +
        "☼H#######~~~####H############☼" +
        "☼H   &          H   &        ☼" +
        "☼##H~~~~&     ############H  ☼" +
        "☼» H                      H  ☼" +
        "☼########~~~~~~~H########&H  ☼" +
        "☼   $       $   H         H& ☼" +
        "☼~~~~  ~~~#########~~~~~  H  ☼" +
        "☼H                    ~~~~H  ☼" +
        "☼##☼☼☼☼☼☼#x &☼☼☼☼☼☼☼  &   H  ☼" +
        "☼~~      ~~~(&   &     & &H  ☼" +
        "☼  H#####   ###########  WH  ☼" +
        "☼  H    $   ~~~~~~~~~~~~~~H  ☼" +
        "☼  H####H   »W  @@&       H  ☼" +
        "☼☼☼☼☼☼☼☼☼######☼☼☼☼☼☼☼#######☼" +
        "☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼"
    );

    const heroPoint = board.getHero();

    const shortestPath = getTheBestPath(board, heroPoint);

    assertEquals(",right,sleftdown,left,fallingdown,fallingdown,right",
        shortestPath.directions.toString());
}

const testDigHole = () => {
    let board = new Board(
        "☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼" +
        "☼~~~~~~~~~~   @$$     ~~~~~~~☼" +
        "☼HH  $    H##########H  $m   ☼" +
        "☼######H  H   $      H#☼☼☼☼☼#☼" +
        "☼    @ H#####H#####H##  ~~~~~☼" +
        "☼W   & H ~   H m&  H  ~~    W☼" +
        "☼#####H#     H    @H $ &~~   ☼" +
        "☼  &  H   H######H##     $~~ ☼" +
        "☼     H~~~H &  W H      m   #☼" +
        "☼     H      H#########H     ☼" +
        "☼    H## &   H#       ## (   ☼" +
        "☼H###H######### H###H #####H#☼" +
        "☼H   H          H# #H   ) ►H ☼" +
        "☼H#######   ###### ##########☼" +
        "☼H          »              & ☼" +
        "☼H#######~~~####H############☼" +
        "☼H   &          H   &        ☼" +
        "☼##H~~~~&     ############H  ☼" +
        "☼» H                      H  ☼" +
        "☼########~~~~~~~H########&H  ☼" +
        "☼   $       $   H         H& ☼" +
        "☼~~~~  ~~~#########~~~~~  H  ☼" +
        "☼H                    ~~~~H  ☼" +
        "☼##☼☼☼☼☼☼#x &☼☼☼☼☼☼☼  &   H  ☼" +
        "☼~~      ~~~(&   &     & &H  ☼" +
        "☼  H#####   ###########  WH  ☼" +
        "☼  H    $   ~~~~~~~~~~~~~~H  ☼" +
        "☼  H####H   »W  @@&       H  ☼" +
        "☼☼☼☼☼☼☼☼☼######☼☼☼☼☼☼☼#######☼" +
        "☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼"
    );

    const heroPoint = board.getHero();
    const robbers = board.getRobbers();
    const diggingResult = digHoleIfNeeded(board, heroPoint, robbers);

    assertEquals("sleftdown",
        diggingResult);
}

const testGetEnemyLeftDistance = () => {
    let board = new Board(
        "☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼" +
        "☼~~~~~~~~~~   @$$     ~~~~~~~☼" +
        "☼HH  $    H##########H  $m   ☼" +
        "☼######H  H   $      H#☼☼☼☼☼#☼" +
        "☼    @ H#####H#####H##  ~~~~~☼" +
        "☼W   & H ~   H m&  H  ~~    W☼" +
        "☼#####H#     H    @H $ &~~   ☼" +
        "☼  &  H   H######H##     $~~ ☼" +
        "☼     H~~~H &  W H      m   #☼" +
        "☼     H      H#########H     ☼" +
        "☼    H## &   H#       ## (   ☼" +
        "☼H###H######### H###H #####H#☼" +
        "☼H   H          H# #HP    ►H ☼" +
        "☼H#######   ###### ##########☼" +
        "☼H          »              & ☼" +
        "☼H#######~~~####H############☼" +
        "☼H   &          H   &        ☼" +
        "☼##H~~~~&     ############H  ☼" +
        "☼» H                      H  ☼" +
        "☼########~~~~~~~H########&H  ☼" +
        "☼   $       $   H         H& ☼" +
        "☼~~~~  ~~~#########~~~~~  H  ☼" +
        "☼H                    ~~~~H  ☼" +
        "☼##☼☼☼☼☼☼#x &☼☼☼☼☼☼☼  &   H  ☼" +
        "☼~~      ~~~(&   &     & &H  ☼" +
        "☼  H#####   ###########  WH  ☼" +
        "☼  H    $   ~~~~~~~~~~~~~~H  ☼" +
        "☼  H####H   »W  @@&       H  ☼" +
        "☼☼☼☼☼☼☼☼☼######☼☼☼☼☼☼☼#######☼" +
        "☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼"
    );

    const heroPoint = board.getHero();
    const walls = board.getNonRuinableWalls();
    const bricks = board.getRuinableWalls();
    const enemies = board.getEnemies();
    const shot = getEnemyLeftShot(board, heroPoint, walls, bricks, enemies);

    assertEquals(5,
        shot.distance);
}

const testSetBulletCounter = () => {
    let board = new Board(
        "☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼" +
        "☼~~~~~~~~~~   @$$     ~~~~~~~☼" +
        "☼HH  $    H##########H  $m   ☼" +
        "☼######H  H   $      H#☼☼☼☼☼#☼" +
        "☼    @ H#####H#####H##  ~~~~~☼" +
        "☼W   & H ~   H m&  H  ~~    W☼" +
        "☼#####H#     H    @H $ &~~   ☼" +
        "☼  &  H   H######H##     $~~ ☼" +
        "☼     H~~~H &  W H      m   #☼" +
        "☼     H      H#########H     ☼" +
        "☼    H## &   H#       ## (   ☼" +
        "☼H###H######### H###H #####H#☼" +
        "☼H   H          H# #HP    ►H ☼" +
        "☼H#######   ###### ##########☼" +
        "☼H          »              & ☼" +
        "☼H#######~~~####H############☼" +
        "☼H   &          H   &        ☼" +
        "☼##H~~~~&     ############H  ☼" +
        "☼» H                      H  ☼" +
        "☼########~~~~~~~H########&H  ☼" +
        "☼   $       $   H         H& ☼" +
        "☼~~~~  ~~~#########~~~~~  H  ☼" +
        "☼H                    ~~~~H  ☼" +
        "☼##☼☼☼☼☼☼#x &☼☼☼☼☼☼☼  &   H  ☼" +
        "☼~~      ~~~(&   &     & &H  ☼" +
        "☼  H#####   ###########  WH  ☼" +
        "☼  H    $   ~~~~~~~~~~~~~~H  ☼" +
        "☼  H####H   »W  @@&       H  ☼" +
        "☼☼☼☼☼☼☼☼☼######☼☼☼☼☼☼☼#######☼" +
        "☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼"
    );

    const heroPoint = board.getHero();
    const walls = board.getNonRuinableWalls();
    const bricks = board.getRuinableWalls();
    const enemies = board.getEnemies();
    const shot = getEnemyLeftShot(board, heroPoint, walls, bricks, enemies);
    const distance = shot.distance;
    const bullets_array = [];

    let myBullet = bullets_array.find(bullet => bullet.y == heroPoint.y && bullet.counter > 0);

    assertEquals(true, distance > 0 && myBullet === undefined);

    setBulletCounter(bullets_array, heroPoint.y, new Shot(5, 1), 1);

    assertEquals([{ y: heroPoint.y, counter: 5 / 1.8 }],
        bullets_array);

    myBullet = bullets_array.find(bullet => bullet.coordinate == heroPoint.y && bullet.counter > 0);

    assertEquals(false, distance > 0 && myBullet === undefined);
}

const testBug1 = () => {
    let board = new Board(
        "☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼" +
        "☼                          & ☼" +
        "☼##H########################H☼" +
        "☼  H     $ $   m   @     &  H☼" +
        "☼H☼☼#☼☼H    H#########H     H☼" +
        "☼H     H    H         H#####H☼" +
        "☼H#☼#☼#H  & H W&      H  ~~~ ☼" +
        "☼H  ~  H~~~~H~~~~~~@  H$C   ►☼" +
        "☼H     H    H$    H###☼☼☼☼☼☼H☼" +
        "☼H     H    H#####H        »H☼" +
        "☼☼###☼##☼##☼H         H###H##☼" +
        "☼☼###☼~~~~  H$        H & H##☼" +
        "☼☼   ☼&    (H » ~~~~~~H  &H  ☼" +
        "☼########H###☼☼☼☼     H &####☼" +
        "☼        H m&   &     H      ☼" +
        "☼H##########################H☼" +
        "☼H          $     &~~~      H☼" +
        "☼#######H#######        &   H☼" +
        "☼       H~~~~~~~~~~   $    WH☼" +
        "☼    W  H&   ##H   #######H##☼" +
        "☼  @    H    ##H          H  ☼" +
        "☼##H##### $  ########H#######☼" +
        "☼  HW        & & $&  H       ☼" +
        "☼#########H##########H&      ☼" +
        "☼         H&      @  H   &   ☼" +
        "☼☼☼     @ H~~~~~~~~~~H  m    ☼" +
        "☼$  &H######         #######H☼" +
        "☼H☼  H  »)                W H☼" +
        "☼##########☼☼☼######☼☼######H☼" +
        "☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼"
    );

    const heroPoint = board.getHero();

    const shortestPath = getTheBestPath(board, heroPoint);

    assertEquals(10, shortestPath.points.length);
}

const testTheMostEfficientPath = () => {
    let board = new Board(
        "☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼" +
        "☼                          & ☼" +
        "☼##H########################H☼" +
        "☼  H     $ $   m   @     &  H☼" +
        "☼H☼☼#☼☼H    H#########H     H☼" +
        "☼H     H    H         H#####H☼" +
        "☼H#☼#☼#H  & H W&      H  ~~~ ☼" +
        "☼H  ~  H~~~~H~~~~~~@  H$    ►☼" +
        "☼H     H    H$    H###☼☼☼☼☼☼H☼" +
        "☼H     H    H#####H        &H☼" +
        "☼☼###☼##☼##☼H         H###H##☼" +
        "☼☼###☼~~~~  H$        H & H##☼" +
        "☼☼   ☼&    (H » ~~~~~~H  &H  ☼" +
        "☼########H###☼☼☼☼     H &####☼" +
        "☼        H m&   &     H      ☼" +
        "☼H##########################H☼" +
        "☼H          $     &~~~      H☼" +
        "☼#######H#######        &   H☼" +
        "☼       H~~~~~~~~~~   $    WH☼" +
        "☼    W  H&   ##H   #######H##☼" +
        "☼  @    H    ##H          H  ☼" +
        "☼##H##### $  ########H#######☼" +
        "☼  HW        & & $&  H       ☼" +
        "☼#########H##########H&      ☼" +
        "☼         H&      @  H   &   ☼" +
        "☼☼☼     @ H~~~~~~~~~~H  m    ☼" +
        "☼$  &H######         #######H☼" +
        "☼H☼  H  »)                W H☼" +
        "☼##########☼☼☼######☼☼######H☼" +
        "☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼"
    );

    const heroPoint = board.getHero();

    const shortestPath = getTheBestPath(board, heroPoint);

    assertEquals(",left,left,left,left,left,left,left,left,left",
        shortestPath.directions.toString());
}

const testTheCircularPath = () => {
    // let board = new Board(
    //     "☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼" +
    //     "☼~~~~~~~~~~ $ W  $&   ~~~~~~~☼" +
    //     "☼HH W m   H##########H  $    ☼" +
    //     "☼######H  H      &WC H#☼☼☼☼☼#☼" +
    //     "☼x     H#####H#####H##  ~~~~~☼" +
    //     "☼     &H ~   H     HC ~~  &  ☼" +
    //     "☼#####H#     H    @H    ~~   ☼" +
    //     "☼    &H   H######H##      ~~ ☼" +
    //     "☼     H~~~H      H          #☼" +
    //     "☼     H      H#########H     ☼" +
    //     "☼    H## $   H#       ##     ☼" +
    //     "☼H###H######### H###H #####H#☼" +
    //     "☼H   H          H# #H     @H ☼" +
    //     "☼H#######  C###### ##########☼" +
    //     "☼H     )&       &$       &   ☼" +
    //     "☼H#######~~~####H############☼" +
    //     "☼H              H        &&  ☼" +
    //     "☼##H~~~~     C############H  ☼" +
    //     "☼  H             @    &$ $H  ☼" +
    //     "☼########~~~~~~~H######## H@ ☼" +
    //     "☼              &H &       H  ☼" +
    //     "☼~~~~  ~~~#########~~~~~  H &☼" +
    //     "☼H         x &     W  ~~~~H  ☼" +
    //     "☼##☼☼☼☼☼☼#   ☼☼☼☼☼☼☼     $H m☼" +
    //     "☼~~m    &~~~             &H& ☼" +
    //     "☼  H#####$O ###########   H  ☼" +
    //     "☼ $H @     &~~~~~~~~~~~~~~H  ☼" +
    //     "☼  H####H            W    H& ☼" +
    //     "☼☼☼☼☼☼☼☼☼######☼☼☼☼☼☼☼#######☼" +
    //     "☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼"
    // );

    // const heroPoint = board.getHero();

    // const shortestPath = getTheBestPath(board, heroPoint);

    // assertEquals(",left,left,left,left,left",
    //      shortestPath.directions.toString());
}



// ☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼
// ☼~~~~~~~~~~        »  ~~~~~~~☼
// ☼HH       H##########H       ☼
// ☼######H  H          H ☼☼☼☼☼#☼
// ☼      H#####X#####H##  ~~~~~☼
// ☼      H ~  &H     H @J~&  Wm☼
// ☼#####H#     H (  @H    ~~ $ ☼
// ☼ W   H   H######H##      ~~ ☼
// ☼ U$ mH~~~H   &  H$         #☼
// ☼     H   && H#########H    @☼
// ☼  $ H##W    H# &     ## $   ☼
// ☼H###H######### H###H #####H#☼
// ☼H   H          H#&#H    @ H ☼
// ☼H#######   ###### ##########☼
// ☼H »&     &         $  @&    ☼
// ☼H#######~~~####H############☼
// ☼H   m   $      H     $ &    ☼
// ☼##H~~~~      ############H  ☼
// ☼  H    &      &W         H  ☼
// ☼########~~~~~~~H########&H  ☼
// ☼   &           H         H $☼
// ☼~~~~  ~~~#########~~~~~  H $☼
// ☼H                    ~~~~H  ☼
// ☼##☼☼☼☼☼☼#   ☼☼☼☼☼☼☼  &   H  ☼
// ☼~~      ~~~              H &☼
// ☼  H#####   ###########   HF ☼
// ☼  H        ~~~~~~~~~~~~~YH  ☼
// ☼& H####H         &     W H& ☼
// ☼☼☼☼☼☼☼☼☼######☼☼☼☼☼☼☼#######☼
// ☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼


// ☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼
// ☼           @    &@     &    ☼
// ☼##H########################H☼
// ☼  H  &  &     W$    &  &   H☼
// ☼H☼☼#☼☼H    H#########H @   H☼
// ☼H     H    H $       H#####H☼
// ☼H#☼#☼#H    H     $   H  ~~~ ☼
// ☼H  ~  H~~~~H~~~~~~  WH @$& &☼
// ☼H  & $H  & H   $ H###☼☼☼☼☼☼H☼
// ☼H     H    H#####H         H☼
// ☼☼###☼##☼##☼H         H###H##☼
// ☼☼###☼~~~~  H&  &     H  $H##☼
// ☼☼   ☼    m)H   ~~~~~~H   H  ☼
// ☼########H###☼☼☼☼     H  ####☼
// ☼ &      H &  @   &   H      ☼
// ☼H##########################H☼
// ☼H  W              ~~~     &H☼
// ☼#######H#######          & H☼
// ☼W      H~~~~~~~~~~        &H☼
// ☼    W  H    ##H   #######H##☼
// ☼m      H   m##H          H $☼
// ☼##H#####    ########H#######☼
// ☼  H                 H       ☼
// ☼#########H##########H    &  ☼
// ☼ » &     H       $  H       ☼
// ☼☼☼       H~~~~~~~~~~H   ◄   ☼
// ☼   $H######   &     #######H☼
// ☼H☼  H                      H☼
// ☼##########☼☼☼######☼☼######H☼
// ☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼

module.exports = PathFinderTests;