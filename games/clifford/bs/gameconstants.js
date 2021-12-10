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
    static shoot_left_direction = "shootleft";
    static shoot_right_direction = "shootright";

    //constants
    static mask_potion_duration = 15;
    static mask_potion_price = 0.5;
    static portal_price = 0.2;
    
    static get glow_clue_price()
    {
        return this.increment_for_glow_clue_price + this.default_glow_clue_price;
    }

    static get knife_clue_price()
    {
        return this.increment_for_knife_clue_price + this.default_knife_clue_price;
    }

    static get ring_clue_price()
    {
        return this.increment_for_ring_clue_price + this.default_ring_clue_price;
    }

    static default_glow_clue_price = 3;
    static default_knife_clue_price = 4;
    static default_ring_clue_price = 5;

    static increment_for_glow_clue_price = 0;
    static increment_for_knife_clue_price = 0;
    static increment_for_ring_clue_price = 0;
}

module.exports.GameConstants = GameConstants;