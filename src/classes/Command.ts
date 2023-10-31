import { SlashCommandBuilder } from 'discord.js';

export class Command {
    data = new SlashCommandBuilder().setName('').setDescription('').setDescriptionLocalization('fr', '');
    public execute(...args: any): any { return; }
}
