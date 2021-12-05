//►
//◄
//$ & @ - treasures

const { getTreasuresOnBoard, getTheNextPoint, findPathsFromPoint } = require("../bs/pathfinder.js");
const { CliffordPath } = require("../bs/path.js");
const { assertEquals } = require("./basetests.js");
var Games = require('./../../../engine/games.js');
var Board = Games.require('../board.js');
var Direction = Games.require('../direction.js');
const Point = require('./../../../engine/point.js');

const PathFinderTests = () => {
    testGetTreasuresOnBoard();
    testGetTheNextPoint();
    testGetTheNextPointAbovePipe();
    testFindPathFromPoint();
    testFindPathFromPipe();
    testFindPathFromBlocked();
    testFindPathFromBlocked1();
    testFindPathFromBlocked2();
    testFindPathFromBlocked3();
    testFindPathFromBlocked4();
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

const testGetTheNextPoint = () => {
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
        "☼H##    H   ►    & H~~~~~~@&&☼" +
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

    const heroPoint = board.getHero();
    const ground_cached = [...board.getWalls(), ...board.getLadders()];
    const pipes_cached = board.getPipes();
    const startPath = new CliffordPath([heroPoint],[Direction.STOP], false)
    const theNextPoint = getTheNextPoint(board, startPath, heroPoint, ground_cached, pipes_cached);

    assertEquals(new Point(heroPoint.x, heroPoint.y - 2), theNextPoint);
}

const testGetTheNextPointAbovePipe = () => {
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
        "☼H       $ & $&    H ►    &☼H☼" +
        "☼H#####         H##H# ##() (H☼" +
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
        "☼H   H    &    $ &$@         ☼" +
        "☼H  ####H######         #####☼" +
        "☼H      H      H#######H@   &☼" +
        "☼##############H       H#####☼" +
        "☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼"
    );

    const heroPoint = board.getHero();//21,17
    const ground_cached = [...board.getWalls(), ...board.getLadders()];
    const pipes_cached = board.getPipes();
    const startPath = new CliffordPath([heroPoint],[Direction.STOP], false)
    const theNextPoint = getTheNextPoint(board, startPath, heroPoint, ground_cached, pipes_cached);

    assertEquals(new Point(heroPoint.x, heroPoint.y - 3), theNextPoint);
}

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

    const allPath = findPathsFromPoint(board, heroPoint);
    
    const shortestPath = allPath.find(path => path.isFinished && path.isTheFirstShortest)

    assertEquals(",srightdown,right,down",
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

    const allPath = findPathsFromPoint(board, heroPoint);
    
    const shortestPath = allPath.find(path => path.isFinished && path.isTheFirstShortest)

    assertEquals(",left,left,down",
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

    const allPath = findPathsFromPoint(board, heroPoint);
    
    const shortestPath = allPath.find(path => path.isFinished && path.isTheFirstShortest)

    assertEquals(",right,srightdown,right",
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

    const allPath = findPathsFromPoint(board, heroPoint);
    
    const shortestPath = allPath.find(path => path.isFinished && path.isTheFirstShortest)

    assertEquals(",srightdown,right,down,srightdown,right",
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

    const allPath = findPathsFromPoint(board, heroPoint);
    
    const shortestPath = allPath.find(path => path.isFinished && path.isTheFirstShortest)

    assertEquals(",srightdown,right,down,srightdown,right",
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

    const allPath = findPathsFromPoint(board, heroPoint);
    
    const shortestPath = allPath.find(path => path.isFinished && path.isTheFirstShortest)

    assertEquals(",srightdown,right,sleftdown,left,down,left",
         shortestPath.directions.toString());
}

const testFindPathFromBlocked4 = () => {
    let board = new Board(
        "☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼"+
        "☼                   $  &&    ☼"+
        "☼##H########################H☼"+
        "☼  H      &    &            H☼"+
        "☼H☼☼#☼☼H &  H#########H  W  H☼"+
        "☼H     H    H         H#####H☼"+
        "☼H#☼#☼#H   $H         H  ~~~ ☼"+
        "☼H  ~  H~~~~H~~J~~~)  H      ☼"+
        "☼H$    H    H    ►H###☼☼☼☼☼☼H☼"+
        "☼H   & H    X#####H         H☼"+
        "☼☼###☼##☼##☼H&&       H###H##☼"+
        "☼☼###☼~~~~$ H & m     H   H##☼"+
        "☼☼   ☼  &   H   ~~~~~~H& $H  ☼"+
        "☼########H###☼☼☼☼     H  ####☼"+
        "☼W &     H@$     W    H  @   ☼"+
        "☼H##########################H☼"+
        "☼H    » • • • • W •~~~      H☼"+
        "☼#######H#######            H☼"+
        "☼       H~~~~~~~~~~   $     H☼"+
        "☼       H   $##H   #######H##☼"+
        "☼       X    ##H&   @     H  ☼"+
        "☼##H#####    ########H#######☼"+
        "☼  H       &m    &   H  &    ☼"+
        "☼#########H##########H       ☼"+
        "☼ @ W     H &        H  $    ☼"+
        "☼☼☼    $  H~~~~~~~~~~H       ☼"+
        "☼ @  H######&     &  #######H☼"+
        "☼H☼  H                m   & H☼"+
        "☼##########☼☼☼######☼☼######H☼"+
        "☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼"
    );

    const heroPoint = board.getHero();

    const allPath = findPathsFromPoint(board, heroPoint);
    
    const shortestPath = allPath.find(path => path.isFinished && path.isTheFirstShortest)

    assertEquals(",srightdown,right,sleftdown,left,down,left",
         shortestPath.directions.toString());
}

module.exports = PathFinderTests;