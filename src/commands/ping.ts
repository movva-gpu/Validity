import { SlashCommandBuilder, ChatInputCommandInteraction } from 'discord.js'

export const data = new SlashCommandBuilder()
    .setName('ping')
    .setDescription('The ping of the bot!')
    .setDescriptionLocalizations({ 'fr': 'Le ping du bot!' });
export function execute(interaction: ChatInputCommandInteraction, ping: string) {
    interaction.reply(`My ping is of ${ping}ms! :D`);
}


// TODO: Remove that command after development