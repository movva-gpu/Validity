import { ChatInputCommandInteraction, EmbedBuilder, SlashCommandBuilder } from 'discord.js'

export type Command = {
    data: SlashCommandBuilder;
    execute: (arg0: ChatInputCommandInteraction, ...args: unknown[]) => Promise<number | unknown | void>;
    // Unknown is when the command can return something different, like an EmbedBuilder or a MessageCollector.
}