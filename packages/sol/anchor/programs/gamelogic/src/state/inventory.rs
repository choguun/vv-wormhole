use anchor_lang::prelude::*;

use crate::state::item::Item;

#[account]
pub struct Inventory {
    pub player: Pubkey,
    pub items: Vec<Item>,
    pub bump: u8,
}

impl Inventory {
    pub const MAX_SIZE: usize = 32 + 4 + (50 * (4 + 32 + 8)) + 1;
}
