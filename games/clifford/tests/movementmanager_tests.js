const { MovementManager } = require("../bs/movementmanager");
var Games = require('./../../../engine/games.js');
var Direction = Games.require('../direction.js');
var Board = Games.require('../board.js');
const { assertEquals } = require("./basetests.js");

module.exports = () => {
    testMovementManagerWorks();
    testMovementManagerWorks1();
    testMovementManagerWorks2();
    testMovementManagerWorks3();
    testMovementManagerWorks4();
    testMovementManagerWorks5();
    testMovementManagerWorks6();
    testMovementManagerWorks7();
    testMovementManagerWorks8();
    testMovementManagerWorks9();
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

    assertEquals(Direction.LEFT, nextDirection);
}

const testMovementManagerWorks1 = () => {
    let board = new Board(
        "☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼" +
        "☼                          & ☼" +
        "☼##H########################H☼" +
        "☼  H     $ $   m   @     &  H☼" +
        "☼H☼☼#☼☼H    H#########H     H☼" +
        "☼H     H    H         H#####H☼" +
        "☼H#☼#☼#H  & H W&      H  ~~~ ☼" +
        "☼H  ~  H~~~~H~~~~~~@  H$)   ►☼" +
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

    const movementManager = new MovementManager(board);

    const nextDirection = movementManager.getTheNextMove();

    assertEquals(Direction.DOWN, nextDirection);
}

const testMovementManagerWorks2 = () => {
    let board = new Board(
        "☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼" +
        "☼~~~~~~~~~~ &   &  &  ~~~~~~~☼" +
        "☼HH & &   H##########H  $    ☼" +
        "☼######H  H      &   H#☼☼☼☼☼#☼" +
        "☼      H#####H#####H##  ~~~~~☼" +
        "☼      H ~   H  && H  ~~&  & ☼" +
        "☼#####H#     H   m H   &~~ $ ☼" +
        "☼&   mH   H######H##   $& ~~»☼" +
        "☼m    H~~~H      H   $@     #☼" +
        "☼    $H      H#########H    &☼" +
        "☼    H##     H#    $&&## W   ☼" +
        "☼H###H######### H###H #####H#☼" +
        "☼H@  H       @ @H# #H      H ☼" +
        "☼H#######$  ###### ##########☼" +
        "☼H      $       & &  $       ☼" +
        "☼H#######~~~####H############☼" +
        "☼H   &          H&   W       ☼" +
        "☼##H~~~~    W ############H$ ☼" +
        "☼  H                      H  ☼" +
        "☼########~~~~~~~H######## H  ☼" +
        "☼               H         H  ☼" +
        "☼~~~~  ~~~#########~~~~~  H  ☼" +
        "☼H                W   ~~~~H  ☼" +
        "☼##☼☼☼☼☼☼# W ☼☼☼☼☼☼☼      H  ☼" +
        "☼~~      ~~~     ►        H  ☼" +
        "☼  H#####   ######y####   H @☼" +
        "☼  H        ~~~~~~~~~~~~Y~H  ☼" +
        "☼  H####H             )   H  ☼" +
        "☼☼☼☼☼☼☼☼☼######☼☼☼☼☼☼☼#######☼" +
        "☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼"
    );

    const movementManager = new MovementManager(board);

    const nextDirection = movementManager.getTheNextMove();

    assertEquals(Direction.RIGHT, nextDirection);
}

const testMovementManagerWorks3 = () => {
    let board = new Board(
        "☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼" +
        "☼~~~~~~~~~~ &   &  &  ~~~~~~~☼" +
        "☼HH & &   H##########H  $    ☼" +
        "☼######H  H      &   H#☼☼☼☼☼#☼" +
        "☼      H#####H#####H##  ~~~~~☼" +
        "☼      H ~   H  && H  ~~&  & ☼" +
        "☼#####H#     H   m H   &~~ $ ☼" +
        "☼&   mH   H######H##   $& ~~»☼" +
        "☼m    H~~~H      H   $@     #☼" +
        "☼    $H      H#########H    &☼" +
        "☼    H##     H#    $&&## W   ☼" +
        "☼H###H######### H###H #####H#☼" +
        "☼H@  H       @ @H# #H      H ☼" +
        "☼H#######$  ###### ##########☼" +
        "☼H      $       & &  $       ☼" +
        "☼H#######~~~####H############☼" +
        "☼H   &          H&   W       ☼" +
        "☼##H~~~~    W ############H$ ☼" +
        "☼  H                      H  ☼" +
        "☼########~~~~~~~H######## H  ☼" +
        "☼               H         H  ☼" +
        "☼~~~~  ~~~#########~~~~~  H  ☼" +
        "☼H                W   ~~~~H  ☼" +
        "☼##☼☼☼☼☼☼# W ☼☼☼☼☼☼☼      H  ☼" +
        "☼~~      ~~~      ►       H  ☼" +
        "☼  H#####   ######y####   H @☼" +
        "☼  H        ~~~~~~~~~~~~Y~H  ☼" +
        "☼  H####H             )   H  ☼" +
        "☼☼☼☼☼☼☼☼☼######☼☼☼☼☼☼☼#######☼" +
        "☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼"
    );

    const movementManager = new MovementManager(board);

    const nextDirection = movementManager.getTheNextMove();

    assertEquals(Direction.RIGHT, nextDirection);
}

const testMovementManagerWorks4 = () => {
    let board = new Board(
        "☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼" +
        "☼~~~~~~~~~~ &   &  &  ~~~~~~~☼" +
        "☼HH & &   H##########H  $    ☼" +
        "☼######H  H      &   H#☼☼☼☼☼#☼" +
        "☼      H#####H#####H##  ~~~~~☼" +
        "☼      H ~   H  && H  ~~&  & ☼" +
        "☼#####H#     H   m H   &~~ $ ☼" +
        "☼&   mH   H######H##   $& ~~»☼" +
        "☼m    H~~~H      H   $@     #☼" +
        "☼    $H      H#########H    &☼" +
        "☼    H##     H#    $&&## W   ☼" +
        "☼H###H######### H###H #####H#☼" +
        "☼H@  H       @ @H# #H      H ☼" +
        "☼H#######$  ###### ##########☼" +
        "☼H      $       & &  $       ☼" +
        "☼H#######~~~####H############☼" +
        "☼H   &          H&   W       ☼" +
        "☼##H~~~~    W ############H$ ☼" +
        "☼  H                      H  ☼" +
        "☼########~~~~~~~H######## H  ☼" +
        "☼               H         H  ☼" +
        "☼~~~~  ~~~#########~~~~~  H  ☼" +
        "☼H                W   ~~~~H  ☼" +
        "☼##☼☼☼☼☼☼# W ☼☼☼☼☼☼x      H  ☼" +
        "☼~~      ~~~      ►       H  ☼" +
        "☼  H#####   ######y####   H @☼" +
        "☼  H        ~~~~~~~~~~~~Y~H  ☼" +
        "☼  H####H             )   H  ☼" +
        "☼☼☼☼☼☼☼☼☼######☼☼☼☼☼☼☼#######☼" +
        "☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼"
    );

    const movementManager = new MovementManager(board);

    const nextDirection = movementManager.getTheNextMove();

    assertEquals(Direction.CRACK_LEFT, nextDirection);
}

const testMovementManagerWorks5 = () => {
    let board = new Board(
        "☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼" +
        "☼~~~~~~~~~~ &   &  &  ~~~~~~~☼" +
        "☼HH & &   H##########H  $    ☼" +
        "☼######H  H      &   H#☼☼☼☼☼#☼" +
        "☼      H#####H#####H##  ~~~~~☼" +
        "☼      H ~   H  && H  ~~&  & ☼" +
        "☼#####H#     H   m H   &~~ $ ☼" +
        "☼&   mH   H######H##   $& ~~»☼" +
        "☼m    H~~~H      H   $@     #☼" +
        "☼    $H      H#########H    &☼" +
        "☼    H##     H#    $&&## W   ☼" +
        "☼H###H######### H###H #####H#☼" +
        "☼H@  H       @ @H# #H      H ☼" +
        "☼H#######$  ###### ##########☼" +
        "☼H      $       & &  $       ☼" +
        "☼H#######~~~####H############☼" +
        "☼H   &          H&   W       ☼" +
        "☼##H~~~~    W ############H$ ☼" +
        "☼  H                      H  ☼" +
        "☼########~~~~~~~H######## H  ☼" +
        "☼               H         H  ☼" +
        "☼~~~~  ~~~#########~~~~~  H  ☼" +
        "☼H                W   ~~~~H  ☼" +
        "☼##☼☼☼☼☼☼# W ☼X☼☼☼☼☼      H  ☼" +
        "☼~~      ~~~  H◄      ☼   H  ☼" +
        "☼  H#####   ###☼☼☼y☼☼☼☼   H @☼" +
        "☼  H        ~~~~~~~~~~~~Y~H  ☼" +
        "☼  H####H             )   H  ☼" +
        "☼☼☼☼☼☼☼☼☼######☼☼☼☼☼☼☼#######☼" +
        "☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼"
    );

    const movementManager = new MovementManager(board);

    const nextDirection = movementManager.getTheNextMove();

    assertEquals(Direction.RIGHT, nextDirection);
}

const testMovementManagerWorks6 = () => {
    let board = new Board(
        "☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼" +
        "☼~~~~~~~~~~ &   &  &  ~~~~~~~☼" +
        "☼HH & &   H##########H  $    ☼" +
        "☼######H  H      &   H#☼☼☼☼☼#☼" +
        "☼      H#####H#####H##  ~~~~~☼" +
        "☼      H ~   H  && H  ~~&  & ☼" +
        "☼#####H#     H   m H   &~~ $ ☼" +
        "☼&   mH   H######H##   $& ~~»☼" +
        "☼m    H~~~H      H   $@     #☼" +
        "☼    $H      H#########H    &☼" +
        "☼    H##     H#    $&&## W   ☼" +
        "☼H###H######### H###H #####H#☼" +
        "☼H@  H       @ @H# #H      H ☼" +
        "☼H#######$  ###### ##########☼" +
        "☼H      $       & &  $       ☼" +
        "☼H#######~~~####H############☼" +
        "☼H   &          H&   W       ☼" +
        "☼##H~~~~    W ############H$ ☼" +
        "☼  H                      H  ☼" +
        "☼########~~~~~~~H######## H  ☼" +
        "☼               H         H  ☼" +
        "☼~~~~  ~~~#########~~~~~  H  ☼" +
        "☼H                 ►  ~~~~H  ☼" +
        "☼##☼☼☼☼☼☼# W ☼☼☼☼☼☼H      H  ☼" +
        "☼~~      ~~~       X@@    H  ☼" +
        "☼  H#####   ###☼☼☼yH☼☼☼   H @☼" +
        "☼  H        ~~~~~~~~~~~~Y~H  ☼" +
        "☼  H####H             )   H  ☼" +
        "☼☼☼☼☼☼☼☼☼######☼☼☼☼☼☼☼#######☼" +
        "☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼"
    );

    const movementManager = new MovementManager(board);

    const nextDirection = movementManager.getTheNextMove();

    assertEquals(Direction.LEFT, nextDirection);
}

const testMovementManagerWorks7 = () => {
    let board = new Board(
        "☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼" +
        "☼~~~~~~~~~~           ~~~~~~~☼" +
        "☼HH&    m H##########H      @☼" +
        "☼######H  H        & H#☼☼☼☼☼#☼" +
        "☼    $$H#####H#####H##  ~~~~~☼" +
        "☼ W$&  H ~ & H  $$ H  ~~     ☼" +
        "☼#####H#     H     H $  ~~ @ ☼" +
        "☼     H  &H######H##    & ~~»☼" +
        "☼W    H~~~H      Hm         #☼" +
        "☼     H &    H#########H     ☼" +
        "☼   @H##&    H#    &  ##&    ☼" +
        "☼H###H######### H###H #####H#☼" +
        "☼H   H  $       H# #H   &  H ☼" +
        "☼H####### $ ######@##########☼" +
        "☼H @         &         m     ☼" +
        "☼H#######~~~####H############☼" +
        "☼H      &       H &W&     ◄ &☼" +
        "☼##H~~~~      ############X  ☼" +
        "☼  H         &            H  ☼" +
        "☼########~~~~~~~H######## H  ☼" +
        "☼             $(H         H  ☼" +
        "☼~~~~  ~~~#########~~~~~  H  ☼" +
        "☼H                    ~~~~H  ☼" +
        "☼##☼☼☼☼☼☼#  &☼☼☼☼☼☼☼      H  ☼" +
        "☼~~      ~~Y          & $ H  ☼" +
        "☼  H#####   ###########   H  ☼" +
        "☼ WH      & ~~~~~~~~~~~~~~H  ☼" +
        "☼W H####H                 H  ☼" +
        "☼☼☼☼☼☼☼☼☼######☼☼☼☼☼☼☼#######☼" +
        "☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼"
    );

    const movementManager = new MovementManager(board);

    const nextDirection = movementManager.getTheNextMove();

    assertEquals(Direction.LEFT, nextDirection);
}

const testMovementManagerWorks8 = () => {
    let board = new Board(
        "☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼" +
        "☼~~~~~~~~~~           ~~~~~~~☼" +
        "☼HH&    m H##########H      @☼" +
        "☼######H  H        & H#☼☼☼☼☼#☼" +
        "☼    $$H#####H#####H##  ~~~~~☼" +
        "☼ W$&  H ~ & H  $$ H  ~~     ☼" +
        "☼#####H#     H     H $  ~~ @ ☼" +
        "☼     H  &H######H##    & ~~»☼" +
        "☼W    H~~~H      Hm         #☼" +
        "☼     H &    H#########H     ☼" +
        "☼   @H##&    H#    &  ##&    ☼" +
        "☼H###H######### H###H #####H#☼" +
        "☼H   H  $       H# #H   &  H ☼" +
        "☼H####### $ ######@##########☼" +
        "☼H @         &         m     ☼" +
        "☼H#######~~~####H############☼" +
        "☼H      &       H &W&       &☼" +
        "☼##H~~~~      ########Ay##H  ☼" +
        "☼  H         &        H@  H  ☼" +
        "☼########~~~~~~~H#####H&  H  ☼" +
        "☼             $(H         H  ☼" +
        "☼~~~~  ~~~#########~~~~~  H  ☼" +
        "☼H                    ~~~~H  ☼" +
        "☼##☼☼☼☼☼☼#  &☼☼☼☼☼☼☼      H  ☼" +
        "☼~~      ~~Y          & $ H  ☼" +
        "☼  H#####   ###########   H  ☼" +
        "☼ WH      & ~~~~~~~~~~~~~~H  ☼" +
        "☼W H####H                 H  ☼" +
        "☼☼☼☼☼☼☼☼☼######☼☼☼☼☼☼☼#######☼" +
        "☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼"
    );

    const movementManager = new MovementManager(board);

    const nextDirection = movementManager.getTheNextMove();

    assertEquals(Direction.DOWN, nextDirection);
}

const testMovementManagerWorks9 = () => {
    let board = new Board(
        "☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼" +
        "☼~~~~~~~~~~           ~~~~~~~☼" +
        "☼HH&    m H##########H      @☼" +
        "☼######H  H        & H#☼☼☼☼☼#☼" +
        "☼    $$H#####H#####H##  ~~~~~☼" +
        "☼ W$&  H ~ & H  $$ H  ~~     ☼" +
        "☼#####H#     H     H $  ~~ @ ☼" +
        "☼     H  &H######H##    & ~~»☼" +
        "☼W    H~~~H      Hm         #☼" +
        "☼     H &    H#########H     ☼" +
        "☼   @H##&    H#    &  ##&    ☼" +
        "☼H###H######### H###H #####H#☼" +
        "☼H   H  $       H# #H   &  H ☼" +
        "☼H####### $ ######@##########☼" +
        "☼H @         &         m     ☼" +
        "☼H#######~~~####H############☼" +
        "☼H      &       H &W&       &☼" +
        "☼##H~~~~      ########Hy##H  ☼" +
        "☼  H         &        H@  H  ☼" +
        "☼########~~~~~~~H#####H&  H  ☼" +
        "☼             $(H         H  ☼" +
        "☼~~~~  ~~~#########~~~~~  H  ☼" +
        "☼H                    ~~~~H  ☼" +
        "☼##☼☼☼☼☼☼#  &☼☼☼☼☼☼☼      H  ☼" +
        "☼~~      ~~Y          & $ H  ☼" +
        "☼  H#####   ###########   H  ☼" +
        "☼ WH      & ~~~~~~~~~~~~~~X  ☼" +
        "☼W H####H             )   A  ☼" +
        "☼☼☼☼☼☼☼☼☼######☼☼☼☼☼☼☼#######☼" +
        "☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼"
    );

    const movementManager = new MovementManager(board);

    const nextDirection = movementManager.getTheNextMove();

    assertEquals(Direction.RIGHT, nextDirection);
}

