use anchor_lang::prelude::*;

#[error_code]
pub enum ErrorCode {
    #[msg("Too many quests")]
    TooManyQuests,
    #[msg("Quest name too long")]
    QuestNameTooLong,
    #[msg("Username too long")]
    UsernameTooLong,
    #[msg("Quest not found")]
    QuestNotFound,
    #[msg("You have already checked in today.")]
    AlreadyCheckedInToday, // Add this missing variant
}
