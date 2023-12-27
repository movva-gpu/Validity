import { SlashCommandBuilder, ChatInputCommandInteraction, Locale, SlashCommandSubcommandBuilder } from 'discord.js'

import { InitialHelpEmbedButton, invokeHelpEmbed, shortenSubCommand } from '../../globalMethods'
import * as create from './subcommands/create'
import * as deleteCommand from './subcommands/delete'
import { System } from '../../classes/systemHandling/System'
import { langs } from '../..'


export type SystemsDataType = {
    systems: System[]
}

export const data = new SlashCommandBuilder()
    .setName('system')
    .setDescription(langs['en-US'].commands.system.description as string)
    .addSubcommand((subcommand) => {
        for (const locale in langs) {
            subcommand.setDescriptionLocalization(locale as Locale, langs[locale].commands.system.subcommands?.help.description as string);
        }
        return subcommand
            .setName('help')
            .setDescription(langs['en-US'].commands.system.subcommands?.help.description as string);
    })
    .addSubcommand(create.data)
    .addSubcommand(shortenSubCommand(create.data, 'c'))
    .addSubcommand(deleteCommand.data)
    .addSubcommand(shortenSubCommand(deleteCommand.data, 'd'));

    console.log(deleteCommand.data);


    for (const locale in langs) {
        data.setDescriptionLocalization(locale as Locale, langs[locale].commands.system.description as string);
    }

export async function execute(interaction: ChatInputCommandInteraction) {
    const subCommand = interaction.options.getSubcommand(false);

    if (subCommand != '') {
        switch (subCommand) {
            case 'help':
                invokeHelpEmbed(InitialHelpEmbedButton.SystemSubCommands, interaction);
                break;
            case 'c':
            case 'create':
                var createResponses = langs['en-US'].commands.system.subcommands?.create.responses as any;

                if (langs[interaction.locale]?.commands.system.subcommands?.create.responses) createResponses = langs[interaction.locale].commands.system.subcommands?.create.responses as any;
                await create.execute(interaction).then(error => {
                    var errorString: string = create.SystemCreateInteractionReplyError[error];

                    interaction.reply(createResponses[errorString]);
                    console.error(error);
                });
                break;
            case 'd':
            case 'delete':
                var deleteResponses = langs['en-US'].commands.system.subcommands?.delete.responses as any;

                if (langs[interaction.locale]?.commands.system.subcommands?.delete.responses) deleteResponses = langs[interaction.locale].commands.system.subcommands?.delete.responses as any
                await deleteCommand.execute(interaction).then(error => {
                    var errorString: string = deleteCommand.SystemDeleteInteractionReplyError[error];

                    interaction.channel?.send(deleteResponses[errorString]);
                    console.error(error);
                });
                break;
        }
    }
}