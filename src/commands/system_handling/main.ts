import { SlashCommandBuilder, ChatInputCommandInteraction, SlashCommandSubcommandBuilder } from 'discord.js'
// TODO : Add a way to find lang files and use them directly without importing them all to the code
import enUsJson from '../../../res/en-us.json'
import frJson from '../../../res/fr.json'
import { invokeHelpEmbed } from '../../globalCommands'

export const data = new SlashCommandBuilder()
                        .setName('system')
                        .setDescription(enUsJson.commands.system.description)
                        .setDescriptionLocalizations({ 'fr': frJson.commands.system.description })
                        .addSubcommand(new SlashCommandSubcommandBuilder()
                                        .setName('help')
                                        .setDescription(enUsJson.commands.system.subcommands.help.description)
                                        .setDescriptionLocalizations({ 'fr': frJson.commands.system.subcommands.help.description }));
export function execute(interaction: ChatInputCommandInteraction) {
    const subCommand = interaction.options.getSubcommand(false);
    if (subCommand != '') {
        switch (subCommand) {
            case 'help':
                    invokeHelpEmbed(1, interaction);
                break;
        }
    }
}