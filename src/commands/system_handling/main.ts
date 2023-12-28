import { SlashCommandBuilder, ChatInputCommandInteraction, LocaleString, EmbedBuilder } from 'discord.js'

import { InitialHelpEmbedButton, invokeHelpEmbed } from '../../globalMethods'
import * as create from './subcommands/create'
import * as deleteCommand from './subcommands/delete'
import * as show from './subcommands/show'
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
            subcommand.setDescriptionLocalization(locale as LocaleString, langs[locale].commands.system.subcommands?.help.description as string);
        }
        return subcommand
            .setName('help')
            .setDescription(langs['en-US'].commands.system.subcommands?.help.description as string);
    })
    .addSubcommand(create.data)
    .addSubcommand(deleteCommand.data)
    .addSubcommand(show.data);


    for (const locale in langs) {
        data.setDescriptionLocalization(locale as LocaleString, langs[locale].commands.system.description as string);
    }

export async function execute(interaction: ChatInputCommandInteraction) {
    const subCommand = interaction.options.getSubcommand(false);

    if (subCommand != '') {
        switch (subCommand) {
            case 'help':
                invokeHelpEmbed(InitialHelpEmbedButton.SystemSubCommands, interaction);
                break;
            case 'create':
                let createResponses = langs['en-US'].commands.system.subcommands?.create.responses as any;

                if (langs[interaction.locale]?.commands.system.subcommands?.create.responses) createResponses = langs[interaction.locale].commands.system.subcommands?.create.responses as any;
                await create.execute(interaction).then(error => {
                    let errorString: string = create.SystemCreateInteractionReplyError[error];

                    interaction.reply(createResponses[errorString]);
                    console.error(error);
                });
                break;
            case 'delete':
                let deleteResponses = langs['en-US'].commands.system.subcommands?.delete.responses as any;

                if (langs[interaction.locale]?.commands.system.subcommands?.delete.responses) deleteResponses = langs[interaction.locale].commands.system.subcommands?.delete.responses as any;
                await deleteCommand.execute(interaction).then(error => {
                    let errorString: string = deleteCommand.SystemDeleteInteractionReplyError[error];

                    interaction.channel?.send(deleteResponses[errorString]);
                    console.error(error);
                });
                break;
            case 'show':
                let showResponses = langs['en-US'].commands.system.subcommands?.show.responses as any;

                if (langs[interaction.locale]?.commands.system.subcommands?.show.responses) showResponses = langs[interaction.locale].commands.system.subcommands?.show.responses as any;
                await show.execute(interaction).then(embedOrError => {
                    if (!(embedOrError instanceof EmbedBuilder)) { console.log(embedOrError);
                        let errorString: string = show.SystemShowInteractionReplyError[embedOrError];
                        
                        interaction.reply(showResponses[errorString]);
                        return;
                    }
                    interaction.reply({ embeds: [ embedOrError ] });
                });
                break;
        }
    }
}