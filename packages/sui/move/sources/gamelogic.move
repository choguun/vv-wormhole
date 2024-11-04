// SPDX-License-Identifier: MIT

/// Module: gamelogic
module gamelogic::gamelogic {
    use sui::object::{Self, UID};
    use sui::transfer;
    use sui::tx_context::{Self, TxContext};
    use std::string::{Self, String};

    public struct Sword has key, store {
        id: UID,
        magic: u64,
        strength: u64,
    }

    public struct Forge has key {
        id: UID,
        swords_created: u64,
    }

    public struct WorldState has key, store {
        id: UID,
        quest_name: vector<String>,
        quest_quota: vector<u64>,
        treasury_total: u64
    }

    public struct Player has key, store {
        id: UID,
        username: String,
        character_id: u64,
        points: u64
    }

    public struct Leaderboard has key, store {
        id: UID,
        total_points: u64,
    }

    public struct Inventory has key, store {
        id: UID,
        player_id: u64,
        sword_id: u64,
    }

    fun init(ctx: &mut TxContext) {
        let admin = Forge {
            id: object::new(ctx),
            swords_created: 0,
        };

        let world = WorldState {
            id: object::new(ctx),
            quest_name: vector::empty(),
            quest_quota: vector::empty(),
            treasury_total: 0,
        };

        // Transfer the forge object to the module/package publisher
        transfer::transfer(admin, ctx.sender());
        transfer::transfer(world, ctx.sender());
    }

    public fun magic(self: &Sword): u64 {
        self.magic
    }

    public fun strength(self: &Sword): u64 {
        self.strength
    }

    public fun swords_created(self: &Forge): u64 {
        self.swords_created
    }
}