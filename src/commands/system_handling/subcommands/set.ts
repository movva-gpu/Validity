import { ChatInputCommandInteraction, Locale, SlashCommandSubcommandBuilder } from 'discord.js'

import { findUserSystem, getLangsData, getUrlResponse, readDatabase, saveDatabase } from '../../../global_methods';
import { DatabaseError, OptionError, SystemError } from '../system';

const langs = getLangsData();

export const data = new SlashCommandSubcommandBuilder()
    .setName('set')
    .setDescription(langs['en-US'].commands.system.subcommands?.set.description as string)
    .addStringOption(propertyOption => {
        propertyOption.setName('property')
            .setDescription(langs['en-US'].commands.system.subcommands?.set.options?.property as string)
            .setRequired(true)
            .addChoices(
                { name: 'color', value: 'col' },
                { name: 'avatar', value: 'av' },
                { name: 'banner', value: 'ban' },
                { name: 'name', value: 'name' },
                { name: 'description', value: 'dec' }
            );

        for (const locale in langs) {
            if (!langs[locale].commands.system.subcommands?.set) continue;
            propertyOption.setDescriptionLocalization(locale as Locale,
                langs[locale].commands.system.subcommands?.set.options?.property as string);
        }

        return propertyOption;
    })
    .addStringOption(valueOption => {
        valueOption.setName('value')
            .setDescription(langs['en-US'].commands.system.subcommands?.set.options?.value as string)
            .setRequired(true)
            .setMaxLength(1_024);

        for (const locale in langs) {
            if (!langs[locale].commands.system.subcommands?.set) continue;
            valueOption.setDescriptionLocalization(locale as Locale,
                langs[locale].commands.system.subcommands?.set.options?.value as string);
        }

        return valueOption;
});

export async function execute(interaction: ChatInputCommandInteraction): Promise<number | void> {    
    const colorRegex = /^#[0-9A-Fa-f]{6}$/i;

    const property = interaction.options.getString('property');
    const value = interaction.options.getString('value');

    const db = readDatabase();
    if (!db) return DatabaseError.ReadingError;

    const userSysIndex = findUserSystem(interaction.user);
    if (Number.isNaN(userSysIndex)) return SystemError.NoUserSys;
    
    const userSys = db.systems[userSysIndex];

    if (!property || !value) return NaN;
    if (!userSys) return SystemError.NoUserSys;

    let error: unknown;
    switch (property) {
        case 'col':
            if (!colorRegex.test(value)) return OptionError.NotHexColor;
            userSys.color = value;
            break;
        case 'av':
            error = await getUrlResponse(value, OptionError.ImageUrl404,
                OptionError.ImageUrlIsBroken,
                OptionError.ImageWrongType);

            if(typeof error === 'number') return error;

            userSys.avatar = value;
            break;
        case 'ban':
            error = await getUrlResponse(value, OptionError.ImageUrl404,
                OptionError.ImageUrlIsBroken,
                OptionError.ImageWrongType);

            if(typeof error === 'number') return error;

            userSys.banner = value;
            break;
        case 'name':
            if (value.length < 3 || value.length > 64) return OptionError.NameLength;

            userSys.name = value;
            break;
        case 'dec':
            if (value.length > 1024) return OptionError.DescLength;
            
            userSys.desc = value;
            break;
    }

    if(saveDatabase(db, true, false)) return DatabaseError.SavingError;
}