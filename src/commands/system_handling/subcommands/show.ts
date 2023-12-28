import { ChatInputCommandInteraction, EmbedBuilder, LocaleString, SlashCommandSubcommandBuilder } from "discord.js"

import * as embedDefaults from '../../../../conf/embedDefaults.json'
import { langs } from "../../.."
import { createFullEmbed, readDatabase } from "../../../globalMethods";
import { System } from "../../../classes/systemHandling/System";

export const data = new SlashCommandSubcommandBuilder()
    .setName('show')
    .setDescription(langs['en-US'].commands.system.subcommands?.show.description as string)
    .addStringOption(nameOption => {
        nameOption.setName('name')
            .setDescription(langs['en-US'].commands.system.subcommands?.show.options?.name as string)
            .setRequired(false)
            .setMinLength(3)
            .setMaxLength(64);
        for (const locale in langs) {
            nameOption.setDescriptionLocalization(locale as LocaleString, langs[locale].commands.system.subcommands?.show.options?.name as string);
        }
        return nameOption;
    })
    .addStringOption(uidOption => {
        uidOption.setName('uid')
            .setDescription(langs['en-US'].commands.system.subcommands?.show.options?.uid as string)
            .setRequired(false)
            .setMinLength(35) // by default generateUID() generates a string of length 35 characters
            .setMaxLength(35);
        for (const locale in langs) {
            uidOption.setDescriptionLocalization(locale as LocaleString, langs[locale].commands.system.subcommands?.show.options?.uid as string);
        }
        return uidOption;
    });
    for (const locale in langs) { data.setDescriptionLocalization(locale as LocaleString, langs[locale].commands.system.subcommands?.show.description as string); }

export async function execute(interaction: ChatInputCommandInteraction): Promise<SystemShowInteractionReplyError | EmbedBuilder> {
    const nameOption = interaction.options.getString('name');
    const uidOption = interaction.options.getString('uid');

    if (nameOption && uidOption) return SystemShowInteractionReplyError.BothUIDandName;

    let databaseRead = readDatabase();
        if (!databaseRead) { return SystemShowInteractionReplyError.ReadingError; }
        let database = databaseRead;

    if (nameOption) {
        let system = database.systems.find((obj: System) => obj.name === nameOption);
        if (!system) return SystemShowInteractionReplyError.NoSystemForGivenName;

        let systemDesc: string | null = system.desc;            if (systemDesc === '') systemDesc = null; 
        let systemBanner: string | null = system.banner;        if (systemBanner === '') systemBanner = null; 
        let systemAvatar: string | null = system.avatar;        if (systemAvatar === '') systemAvatar = null; 
        let systemColor: any = system.color;                    if (systemColor === '') systemColor = embedDefaults.color; 
        let systemColorText = 'No color set';                   if (systemColor !== null) systemColorText = systemColor; 

        let embedToReturn = createFullEmbed(system.name, systemDesc, systemAvatar, systemBanner, null, `System UID : ${system.uid} | Created on ${system.createdAt}`, systemColor, false)
            .addFields({
                name: 'Alters:',
                value: `${system.alters.length}`,
                inline: true
            },
            {
                name: 'Groups:',
                value: `${system.groups.length}`,
                inline: true
            },
            {
                name: 'Color:',
                value: `${systemColorText}`,
                inline: true
            });
        return embedToReturn;
    }

    if (uidOption) {
        let system = database.systems.find((obj: System) => obj.uid === uidOption);
        if (!system) return SystemShowInteractionReplyError.NoSystemForGivenUid;

        let systemDesc: string | null = system.desc;            if (systemDesc === '') systemDesc = null; 
        let systemBanner: string | null = system.banner;        if (systemBanner === '') systemBanner = null; 
        let systemAvatar: string | null = system.avatar;        if (systemAvatar === '') systemAvatar = null; 
        let systemColor: any = system.color;                    if (systemColor === '') systemColor = embedDefaults.color; 
        let systemColorText = 'No color set';                   if (systemColor !== null) systemColorText = systemColor; 

        let embedToReturn = createFullEmbed(system.name, systemDesc, systemAvatar, systemBanner, null, `System UID : ${system.uid} | Created on ${system.createdAt}`, systemColor, false)
            .addFields({
                name: 'Alters:',
                value: `${system.alters.length}`,
                inline: true
            },
            {
                name: 'Groups:',
                value: `${system.groups.length}`,
                inline: true
            },
            {
                name: 'Color:',
                value: `${systemColorText}`,
                inline: true
            });
        return embedToReturn;
    }

    if (!uidOption && !nameOption) {
        let system = database.systems.find((obj: System) => obj.userIDs.find(id => id == interaction.user.id));
        if (!system) return SystemShowInteractionReplyError.NoSystemForGivenName;

        let systemDesc: string | null = system.desc;            if (systemDesc === '') systemDesc = null; 
        let systemBanner: string | null = system.banner;        if (systemBanner === '') systemBanner = null; 
        let systemAvatar: string | null = system.avatar;        if (systemAvatar === '') systemAvatar = null; 
        let systemColor: any = system.color;                    if (systemColor === '') systemColor = embedDefaults.color; 
        let systemColorText = 'No color set';                   if (systemColor !== null) systemColorText = systemColor; 

        let embedToReturn = createFullEmbed(system.name, systemDesc, systemAvatar, systemBanner, null, `System UID : ${system.uid} | Created on ${system.createdAt}`, systemColor, false)
            .addFields({
                name: 'Alters:',
                value: `${system.alters.length}`,
                inline: true
            },
            {
                name: 'Groups:',
                value: `${system.groups.length}`,
                inline: true
            },
            {
                name: 'Color:',
                value: `${systemColorText}`,
                inline: true
            });
        return embedToReturn;
    }

    return NaN;
}

export enum SystemShowInteractionReplyError {
    BothUIDandName,

    ReadingError,

    NoSystemForGivenName,
    NoSystemForGivenUid
}