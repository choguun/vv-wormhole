use anchor_lang::prelude::*;

use crate::state::Player;
use crate::constants;

#[derive(Accounts)]
pub struct UpdatePlayerPoints<'info> {
    #[account(mut, has_one = wallet)]
    pub player: Account<'info, Player>,
    pub wallet: Signer<'info>,
}
