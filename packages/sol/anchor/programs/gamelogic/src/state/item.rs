use anchor_lang::prelude::*;

#[derive(AnchorSerialize, AnchorDeserialize, Clone, Debug)]
pub struct Item {
    pub name: String,
    pub quantity: u64,
}
