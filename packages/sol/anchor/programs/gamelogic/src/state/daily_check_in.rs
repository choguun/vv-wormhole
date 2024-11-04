use anchor_lang::prelude::*;

#[account]
pub struct DailyCheckIn {
    pub player: Pubkey,
    pub last_check_in: i64,
    pub bump: u8,
}

impl DailyCheckIn {
    pub const MAX_SIZE: usize = 32 + 8 + 8 + 1;
}
