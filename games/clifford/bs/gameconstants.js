class GameConstants{
    //movements
    static left_direction = "left";
    static right_direction = "right";
    static up_direction = "up";
    static down_direction = "down";
    static shoot_left_down_direction = "sleftdown";
    static shoot_right_down_direction = "srightdown";
    static left_falling_down_direction = "leftfallingdown";
    static right_falling_down_direction = "rightfallingdown";
    static falling_down_direction = "fallingdown";

    //constants
    static mask_potion_duration = 15;
    static mask_potion_price = 0.5;
    static portal_price = 0.8;
    static glow_clue_price = 1;
    static knife_clue_price = 2;
    static ring_clue_price = 5;
}

module.exports.GameConstants = GameConstants;