use anchor_lang::prelude::*;

#[account]
pub struct Player {
    pub wallet: Pubkey,
    pub username: String,
    pub character_id: u64,
    pub points: u64,
}

impl Player {
    pub const MAX_SIZE: usize = DISCRIMINATOR + 32 + 4 + 32 + 8 + 8;
    pub const MAX_USERNAME_LENGTH: usize = 32;
}

const DISCRIMINATOR: usize = 8;
