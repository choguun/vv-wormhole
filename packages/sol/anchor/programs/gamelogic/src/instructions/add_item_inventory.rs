use anchor_lang::prelude::*;

use crate::state::Player;
use crate::state::Inventory;
use crate::constants;

#[derive(Accounts)]
pub struct AddItemInventory<'info> {
    #[account(
        mut,
        seeds = [b"inventory", player.key().as_ref()],
        bump = inventory.bump,
        has_one = player // Ensure that the inventory belongs to the player
    )]
    pub inventory: Account<'info, Inventory>, // Inventory account for adding items
    #[account(mut)]
    pub player: Signer<'info>, // Player who owns the inventory
}
