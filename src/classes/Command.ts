import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js'

export class Command {
    data = new SlashCommandBuilder().setName('').setDescription('').setDescriptionLocalization('fr', '');
    public execute(interaction: ChatInputCommandInteraction, ...args: any): any { return; }
}
