use anchor_lang::prelude::*;

use crate::state::WorldState;
use crate::constants;

#[derive(Accounts)]
pub struct InitializeWorld<'info> {
    #[account(mut)]
    pub admin: Signer<'info>,
    #[account(
        init,
        payer = admin,
        seeds = [constants::WORLD_SEED, admin.key().as_ref()],
        bump,
        space = 8 + WorldState::MAX_SIZE
    )]
    pub world_state: Account<'info, WorldState>,
    pub system_program: Program<'info, System>,
}
