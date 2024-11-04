use anchor_lang::prelude::*;

use crate::state::Player;
use crate::state::DailyCheckIn;
use crate::constants;

#[derive(Accounts)]
pub struct DoDailyCheckIn<'info> {
    #[account(mut)]
    pub player: Account<'info, Player>, // The player's account to update points

    #[account(
        init_if_needed, 
        payer = wallet, 
        space = 8 + 32 + 8 + 1, // 49 bytes for DailyCheckIn account
        seeds = [b"daily-check-in", player.key().as_ref()], 
        bump
    )]
    pub daily_check_in: Account<'info, DailyCheckIn>, // The player's daily check-in account

    #[account(mut)]
    pub wallet: Signer<'info>, // The player's wallet account (must sign the transaction)
    pub system_program: Program<'info, System>,
}
