import { SlashCommandBuilder, ChatInputCommandInteraction, LocaleString, EmbedBuilder, MessageCollector } from 'discord.js'

import { System } from '../../classes/system_handling/System'
import { InitialHelpEmbedButton, getLangsData, invokeHelpEmbed } from '../../global_methods'

import * as create from './subcommands/create'
import * as deleteCommand from './subcommands/delete'
import * as show from './subcommands/show'
import * as set from './subcommands/set'

const langs = getLangsData();

export type SystemsDataType = {
    systems: System[];
}

export const data = new SlashCommandBuilder()
    .setName('system')
    .setDescription(langs['en-US'].commands.system.description as string)
    .addSubcommand((subcommand) => {
        for (const locale in langs) {
            subcommand.setDescriptionLocalization(locale as LocaleString,
                langs[locale].commands.system.subcommands?.help.description as string);
        }
        return subcommand
            .setName('help')
            .setDescription(langs['en-US'].commands.system.subcommands?.help.description as string);
    })
    .addSubcommand(create.data)
    .addSubcommand(deleteCommand.data)
    .addSubcommand(show.data)
    .addSubcommand(set.data);


    for (const locale in langs) {
        data.setDescriptionLocalization(locale as LocaleString, langs[locale].commands.system.description as string);
    }

export async function execute(interaction: ChatInputCommandInteraction) {
    const subCommand = interaction.options.getSubcommand(false);

    if (subCommand != '') {
        // TODO: Set success property in language files for every subcommands.
        switch (subCommand) {
            case 'help':
                invokeHelpEmbed(InitialHelpEmbedButton.SystemSubCommands, interaction);
                break;
            case 'create':
                var result = await create.execute(interaction);
                handleInteractionReply(result, interaction);
                break;
            case 'delete':
                var resultCollector = await deleteCommand.execute(interaction);
                handleInteractionReply(resultCollector, interaction);
                break;
            case 'show':
                var resultEmbed = await show.execute(interaction);
                handleInteractionReply(resultEmbed, interaction);
                break;
            case'set':
                var result = await set.execute(interaction);
                handleInteractionReply(result, interaction);
                break;
        }
    }
}

export enum DatabaseError {
    SavingError = 0,
    ReadingError
}

export enum OptionError {
    ImageUrl404 = 10,
    ImageUrlIsBroken,
    ImageWrongType,

    NameLength,
    DescLength,

    NotHexColor,

    TooMuchArgs
}

export enum SystemError {
    NoUserSys = 30, // Starts at 30 in case I add too much OptionErrors in the future
    NoSysForName,
    NoSysForUid,
    AlreadyExists
}

export enum InteractionError {
    Timeout = 50
}

function handleInteractionReply(result: unknown, interaction: ChatInputCommandInteraction,
    commandName = interaction.options.getSubcommand() as string) {

    let responses = (
        langs[interaction.locale] && langs[interaction.locale].commands && langs[interaction.locale].commands.system &&
        langs[interaction.locale].commands.system.responses
    ) ?? (
        langs['en-US'] && langs['en-US'].commands && langs['en-US'].commands.system &&
        langs['en-US'].commands.system.responses
    ) ?? undefined;

    let success = (
        langs[interaction.locale] && langs[interaction.locale].commands && langs[interaction.locale].commands.system &&
        langs[interaction.locale].commands.system.subcommands && langs[interaction.locale].commands.system.subcommands?.[commandName] &&
        langs[interaction.locale].commands.system.subcommands?.[commandName].success
    ) ?? (
        langs['en-US'] && langs['en-US'].commands && langs['en-US'].commands.system &&
        langs['en-US'].commands.system.subcommands && langs['en-US'].commands.system.subcommands[commandName] &&
        langs['en-US'].commands.system.subcommands[commandName].success
    ) ?? undefined;

    // It is a specific string for the case in which a MessageCollector is returned.
    let specific = (
        langs[interaction.locale] && langs[interaction.locale].commands && langs[interaction.locale].commands.system &&
        langs[interaction.locale].commands.system.subcommands && langs[interaction.locale].commands.system.subcommands?.[commandName] &&
        langs[interaction.locale].commands.system.subcommands?.[commandName].specific
    ) ?? (
        langs['en-US'] && langs['en-US'].commands && langs['en-US'].commands.system &&
        langs['en-US'].commands.system.subcommands && langs['en-US'].commands.system.subcommands[commandName] &&
        langs['en-US'].commands.system.subcommands[commandName].specific
    ) ?? undefined;

    if (typeof result === 'number') {
        if (!responses) { interaction.reply('Response missing in files'); return; }
        if (!responses[DatabaseError[result] ?? OptionError[result] ?? SystemError[result]]) {
            interaction.reply('Response missing in files for ' + DatabaseError[result] ??
                OptionError[result] ?? SystemError[result]); return;
        }

        interaction.reply(responses[DatabaseError[result] ?? OptionError[result] ?? SystemError[result] ?? responses.NonSensical]);
    }

    if (result instanceof EmbedBuilder) {
        interaction.reply({ embeds: [ result ] });
    }

    if (result instanceof MessageCollector) {
        interaction.reply(specific ?? 'Specific result missing in files for `/system ' + commandName + '`.');
        result.on('collect', async (message) => {
            // TODO : finish /system delete command. (somehow in the file and not here :/). 
            message.channel.send(success ?? 'Success result missing in files for `/system ' + commandName + '`.');
        });
        result.on('end', (m, reason) => {
            if (reason === 'time') {
                if (!responses) { interaction.reply('Response missing in files'); return; }
                if (!responses[InteractionError.Timeout]) {  }
                interaction.channel?.send(responses[InteractionError.Timeout]);
            }
        });
    }

    if (!result) {
        console.log(typeof result);
        interaction.reply(success ?? 'Success result missing in files for `/system ' + commandName + '`.');
    }
}