pub mod constants;
pub mod instructions;
pub mod state;
pub mod error;

use anchor_lang::prelude::*;
use anchor_lang::solana_program::clock::Clock;
use anchor_spl::token::{self, Mint, Token, TokenAccount, MintTo};
use anchor_spl::associated_token::AssociatedToken;

pub use constants::*;
pub use instructions::*;
pub use state::*;
pub use error::ErrorCode;

declare_id!("9YVsx12K6qLkjak2wzpVPgUugauWAvpqpwW9Btixqnpa");

#[program]
pub mod gamelogic {
    use super::*;

    // Initialize the world state PDA
    pub fn initialize_world_state(
        ctx: Context<InitializeWorld>,
        quests_name: Vec<String>,
        treasure_total: u64,
    ) -> Result<()> {
        if quests_name.len() > WorldState::MAX_QUESTS {
            return Err(ErrorCode::TooManyQuests.into());
        }

        for quest_name in &quests_name {
            if quest_name.len() > WorldState::MAX_QUEST_NAME_LENGTH {
                return Err(ErrorCode::QuestNameTooLong.into());
            }
        }

        let world_state = &mut ctx.accounts.world_state;
        world_state.admin = *ctx.accounts.admin.key;
        world_state.quests_name = quests_name.clone();
        world_state.quests_quota = vec![10; quests_name.len()];
        world_state.treasury_total = treasure_total;
        world_state.bump = ctx.bumps.world_state;

        Ok(())
    }

    pub fn create_player(
        ctx: Context<CreatePlayer>,
        username: String,
        character_id: u64,
    ) -> Result<()> {
        if username.len() > Player::MAX_USERNAME_LENGTH {
            return Err(ErrorCode::UsernameTooLong.into());
        }

        let player = &mut ctx.accounts.player;
        player.wallet = *ctx.accounts.wallet.key;
        player.username = username;
        player.character_id = character_id;
        player.points = 0;

        let inventory = &mut ctx.accounts.inventory;
        inventory.player = *ctx.accounts.wallet.key;
        inventory.items = vec![];
        inventory.bump = ctx.bumps.inventory;

        Ok(())
    }

    pub fn update_player_points(
        ctx: Context<UpdatePlayerPoints>,
        points: u64,
    ) -> Result<()> {
        let player = &mut ctx.accounts.player;
        player.points += points;

        Ok(())
    }

    pub fn daily_check_in(ctx: Context<DoDailyCheckIn>, points: u64) -> Result<()> {
        let player = &mut ctx.accounts.player;
        let daily_check_in = &mut ctx.accounts.daily_check_in;
        let current_timestamp = Clock::get()?.unix_timestamp;
    
        // Check if the account is uninitialized (you can use a field that will only be 0 for uninitialized accounts)
        if daily_check_in.last_check_in == 0 {
            // Perform initialization logic if needed
            daily_check_in.last_check_in = current_timestamp - (24 * 60 * 60); // Set to one day before current time
        }
    
        // Check if the player has already checked in today
        let seconds_in_a_day: i64 = 24 * 60 * 60;
        if current_timestamp - daily_check_in.last_check_in < seconds_in_a_day {
            return Err(ErrorCode::AlreadyCheckedInToday.into());
        }
    
        // Update the last check-in timestamp
        daily_check_in.last_check_in = current_timestamp;
        player.points += points;
    
        Ok(())
    }
}
