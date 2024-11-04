use anchor_lang::prelude::*;

use crate::state::Player;
use crate::state::Inventory;
use crate::constants;

#[derive(Accounts)]
pub struct CreatePlayer<'info> {
    #[account(
        init_if_needed,
        payer = wallet,
        seeds = [constants::PLAYER_SEED, wallet.key().as_ref()],
        bump,
        space = 8 + Player::MAX_SIZE
    )]
    pub player: Account<'info, Player>,

    #[account(
        init,
        payer = wallet,
        seeds = [constants::INVENTORY, wallet.key().as_ref()],
        bump,
        space = 8 + Inventory::MAX_SIZE
    )]
    pub inventory: Account<'info, Inventory>,

    #[account(mut)]
    pub wallet: Signer<'info>,
    pub system_program: Program<'info, System>,
}
