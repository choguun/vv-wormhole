use anchor_lang::prelude::*;

#[account]
pub struct WorldState {
    pub admin: Pubkey,
    pub quests_name: Vec<String>,
    pub quests_quota: Vec<u64>,
    pub treasury_total: u64,
    pub bump: u8,
}

impl WorldState {
    pub const MAX_SIZE: usize = DISCRIMINATOR + 32 + 4 + (32 * 50) + 8;
    pub const MAX_QUESTS: usize = 50;
    pub const MAX_QUEST_NAME_LENGTH: usize = 32;
}

const DISCRIMINATOR: usize = 8;
