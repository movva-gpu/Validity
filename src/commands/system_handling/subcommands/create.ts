import {ChatInputCommandInteraction, Locale, SlashCommandSubcommandBuilder} from 'discord.js'

import {System} from '../../../classes/systemHandling/System'
import {generateUID, getUrlResponse, saveDatabase, stringOptionNormalize, userHasSystem} from '../../../globalMethods'
import {SystemsDataType} from '../main'
import {langs} from '../../..'


export const data = new SlashCommandSubcommandBuilder()
    .setName('create')
    .setDescription(langs['en-US'].commands.system.subcommands?.create.description as string)
    .addStringOption(option => {
        for (const locale in langs) {
            option.setDescriptionLocalization(
                locale as Locale, langs[locale].commands.system.subcommands?.create.options?.name as string);
        }
        return option
            .setName('name')
            .setRequired(true)
            .setDescription(langs['en-US'].commands.system.subcommands?.create.options?.name as string)
            .setMaxLength(64)
            .setMinLength(3);
    })
    .addStringOption(option => {
        for (const locale in langs) {
            option.setDescriptionLocalization(
                locale as Locale, langs[locale].commands.system.subcommands?.create.options?.color as string);
        }
        return option
            .setName('color')
            .setDescription(langs['en-US'].commands.system.subcommands?.create.options?.color as string)
            .setMinLength(4) // #234
            .setMaxLength(7); // #234567
    })
    .addStringOption(option => {
        for (const locale in langs) {
            option.setDescriptionLocalization(
                locale as Locale, langs[locale].commands.system.subcommands?.create.options?.description as string);
        }
        return option
            .setName('description')
            .setDescription(langs['en-US'].commands.system.subcommands?.create.options?.description as string)
            .setMaxLength(1024);
    })
    .addStringOption(option => {
        for (const locale in langs) {
            option.setDescriptionLocalization(
                locale as Locale, langs[locale].commands.system.subcommands?.create.options?.avatar as string);
        }
        return option
            .setName('avatar')
            .setDescription(langs['en-US'].commands.system.subcommands?.create.options?.avatar as string);
    });

    for (const locale in langs) {
        data.setDescriptionLocalization(
            locale as Locale, langs[locale].commands.system.subcommands?.create.description as string);
    }

export async function execute(interaction: ChatInputCommandInteraction): Promise<SystemCreateInteractionReplyError> {
    const systemsData: SystemsDataType = require('../../../../data/data.json');
    let avatarUrl: string | undefined;

    if (userHasSystem(interaction.user, systemsData)) return SystemCreateInteractionReplyError.AlreadyExists;
    
    const nameOption = stringOptionNormalize(interaction, 'name', true) as string;
    const colorOption = stringOptionNormalize(interaction, 'color');
    const avatarUrlOption = stringOptionNormalize(interaction, 'avatar');
    const descOption = stringOptionNormalize(interaction, 'description');

    if (colorOption) {
        if (!(colorOption.startsWith('#'))) return SystemCreateInteractionReplyError.NotHexColor;
    }

    if (avatarUrlOption) {
        let error = await getUrlResponse(
            avatarUrlOption, SystemCreateInteractionReplyError.AvatarUrl404,
            SystemCreateInteractionReplyError.AvatarUrlIsBroken,
            SystemCreateInteractionReplyError.AvatarWrongType);

        if(error) return error;
        avatarUrl = avatarUrlOption;
    }

    let system = new System(generateUID(), [ interaction.user.id ], colorOption as `#${string}` | undefined, avatarUrl, undefined, nameOption, descOption);
    const newSystemData: any = systemsData;
    newSystemData.systems.push(system.toJson());
    return saveDatabase(newSystemData, SystemCreateInteractionReplyError.SavingError, SystemCreateInteractionReplyError.NoError);
}

export enum SystemCreateInteractionReplyError {

    NoError,


    AlreadyExists,


    NotHexColor,


    AvatarUrl404,
    AvatarUrlIsBroken,
    AvatarWrongType,


    SavingError
}