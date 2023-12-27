import {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    ChatInputCommandInteraction,
    ColorResolvable,
    ComponentEmojiResolvable,
    EmbedBuilder,
    InteractionReplyOptions,
    User,
    Locale
} from "discord.js"
import * as path from 'path'
import * as fs from 'fs'

import * as embedDefaults from '../conf/embedDefaults.json'
import { image } from '../conf/embedDefaults.json'
import { SystemsDataType } from "./commands/system_handling/main"
import { LangData, langs } from "."

const systemsData = require('../data/data.json') as SystemsDataType;


export function generateToken(length = 5): string {
    const authorizedChars = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let token = '';

    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * authorizedChars.length);
        token += authorizedChars.charAt(randomIndex);
    }

    return token;
}

export function generateUID(UIDLength = 6, tokensLength = 5): string {
    let uid = '';

    for (let i = 0; i < UIDLength - 1; i++) {
        uid += generateToken(tokensLength) + '-';
    }

    systemsData.systems.forEach(element => {
            if (element.uid == uid) uid = generateUID(UIDLength, tokensLength);
        });

    return uid += generateToken(tokensLength);
}


export function createFullEmbed(title: string, description: string | null = null,
        thumbnail: string | null = null, image: string | null = null, url: string | null = null,
        footer = embedDefaults.footer, color = embedDefaults.color as ColorResolvable): EmbedBuilder {
    return new EmbedBuilder()
        .setColor(color)
        .setTitle(title)
        .setThumbnail(thumbnail)
        .setURL(url)
        .setDescription(description)
        .setImage(image)
        .setTimestamp()
        .setFooter({ text: footer, iconURL: embedDefaults.image });
}

export function createEmbed(title: string, description: string | null = null, url: string | null = null,
        footer = embedDefaults.footer, color = embedDefaults.color as ColorResolvable): EmbedBuilder {
    return new EmbedBuilder()
        .setColor(color)
        .setTitle(title)
        .setURL(url)
        .setDescription(description)
        .setTimestamp()
        .setFooter({
        text: footer,
        iconURL: embedDefaults.image
    });
}


export function invokeHelpEmbed(initialMainButton: InitialHelpEmbedButton, interaction: ChatInputCommandInteraction): void {
    var helpTexts = langs['en-US'].helpTexts;

    if (langs[interaction.locale]?.helpTexts) helpTexts = langs[interaction.locale].helpTexts
    const informationEmbed = createFullEmbed(
        helpTexts.info.title,
        helpTexts.info.description, image)
            .addFields(helpTexts.info.fields[0], helpTexts.info.fields[1]);

    const systemSubCommandsEmbed = createEmbed(
        helpTexts.systemSubcommands.title)
        .addFields(helpTexts.systemSubcommands.fields[0], helpTexts.systemSubcommands.fields[1], helpTexts.systemSubcommands.fields[2]);

    const informationButton = createButton('\u2139', ButtonStyle.Secondary, helpTexts.info.buttonLabel)
        .setCustomId('info');
    const systemSubCommandsButton = createButton('📜', ButtonStyle.Secondary, helpTexts.systemSubcommands.buttonLabel)
        .setCustomId('syssubcom');

    switch (initialMainButton) {
        case 0:
            informationButton.setStyle(ButtonStyle.Primary)
            break;

        case 1:
            systemSubCommandsButton.setStyle(ButtonStyle.Primary)

        default:
            break;
    }


    const buttons = new ActionRowBuilder().addComponents(
            informationButton, systemSubCommandsButton
        ) as ActionRowBuilder<ButtonBuilder>;

    const messageOptions = {
        embeds: [] as EmbedBuilder[],
        components: [ buttons ]
    } as InteractionReplyOptions;

    switch (initialMainButton) {
        case 0:
            messageOptions.embeds = [ informationEmbed ];
            break;

        case 1:
            messageOptions.embeds = [ systemSubCommandsEmbed ];
            break;

        default:
            break;
    }

    interaction.reply(messageOptions);

    const collector = interaction.channel?.createMessageComponentCollector();

    collector?.on('collect', async collectorInteraction => {

        switch (collectorInteraction.customId) {
            case 'info':
                try {

                    informationButton.setStyle(ButtonStyle.Primary);
                    systemSubCommandsButton.setStyle(ButtonStyle.Secondary);

                    const newButtons = new ActionRowBuilder().addComponents(
                        informationButton, systemSubCommandsButton
                    ) as ActionRowBuilder<ButtonBuilder>;

                    await collectorInteraction.update({
                        embeds: [ informationEmbed ],
                        components: [ newButtons ]
                    });

                } catch (error) {
                    console.error(error);
                }
                break;

            case 'syssubcom':
                try {

                    informationButton.setStyle(ButtonStyle.Secondary);
                    systemSubCommandsButton.setStyle(ButtonStyle.Primary);

                    const newButtons = new ActionRowBuilder().addComponents(
                        informationButton, systemSubCommandsButton
                    ) as ActionRowBuilder<ButtonBuilder>;

                    collectorInteraction.update({
                        embeds: [ systemSubCommandsEmbed ],
                        components: [ newButtons ]
                    });

                } catch (error) {
                    console.error(error);
                }
                break;
        }
    });
}

export enum InitialHelpEmbedButton {
    Information = 0,

    SystemSubCommands = 1
}


export function createButton(emoji: ComponentEmojiResolvable, style: ButtonStyle, label: string): ButtonBuilder {
    return new ButtonBuilder()
        .setEmoji(emoji)
        .setStyle(style)
        .setLabel(label);
}


export function stringOptionNormalize(interaction: ChatInputCommandInteraction, optionName: string, required: true): string
export function stringOptionNormalize(interaction: ChatInputCommandInteraction, optionName: string): string | undefined
export function stringOptionNormalize(interaction: ChatInputCommandInteraction, optionName: string, required?: boolean): string | undefined {
    if (interaction.options.getString(optionName, required) == null) return undefined;

    return interaction.options.getString(optionName, required) as string;
}


export function saveDatabase<T>(newDatabase: SystemsDataType, objectToReturnOnError: T, objectToReturnOnSuccess: T): T {
    let replyError = objectToReturnOnSuccess;

    fs.writeFile('data/data.json', JSON.stringify(newDatabase), function(err) {
        if (err) { console.error(err); replyError = objectToReturnOnError; } else { console.log('Database was saved'); }
    });

    return replyError;
}

export function userHasSystem(user: User, systemsData: SystemsDataType): boolean {
    let result = false;

    systemsData.systems.forEach((element) => {
        const userIDs = element.userIDs;
        for(let i = 0; i < userIDs.length; i++) {
            if (userIDs[i] == user.id) result = true;
        }
    });

    return result;
}

export function getUserSystemIndex(user: User, systemsData: SystemsDataType): number {
    let result = -1;

    systemsData.systems.forEach((element, index) => {
        const userIDs = element.userIDs;
        for(let i = 0; i < userIDs.length; i++) {
            if (userIDs[i] == user.id) result = index;
        }
    });

    return result;
}


export async function getUrlResponse<T>(url: URL | string, toReturnOn404: T, toReturnOnBroken: T, toReturnOnWrongType: T): Promise<T | undefined> {
    let toReturn = undefined;

    await fetch(url)
        .then(response => {
            response.headers.forEach((element, key) => {
                if (key === 'content-type' && !element.startsWith('image')) toReturn = toReturnOnWrongType; return;
            });
            if (response.status == 404) toReturn = toReturnOn404;
        }).catch(() => {
            toReturn = toReturnOnBroken;
        });

    return toReturn;
}


export function getLangsData(log: boolean = false): LangData {
    const absoluteLangPath = path.join(import.meta.dir, '..', 'res/');
    const notFound: string[] = [];
    const langsData: LangData = {};

    for (const locale in Locale) {
        try {
            let localeId = Locale[locale as keyof typeof Locale];
            let langFilePath = path.join(absoluteLangPath, `${localeId}.json`);
            langsData[localeId] = JSON.parse(fs.readFileSync(langFilePath, 'utf-8'));
        } catch (error) {
            notFound.push(locale);
        }
    }

    if (log) {
        console.log('[WARNING]', notFound, 'language(s) not found!');
    }

    return langsData;
}

export function shortenSubCommand(commandData: SlashCommandSubcommandBuilder, shortenName:string): SlashCommandSubcommandBuilder  {
    const { name, ...rest } = commandData;
    const toReturn = new SlashCommandSubcommandBuilder().setName(shortenName).setDescription(rest.description);
    Object.keys(rest.description_localizations as string[]).forEach(value => {
        if (!rest.description_localizations) return;
        let descriptionLocalization = rest.description_localizations[value as LocaleString];
        if (!descriptionLocalization) return;
        toReturn.setDescriptionLocalization((value as LocaleString), descriptionLocalization);
    });
    rest.options.forEach(value => {
        let optionType = value.type;
        switch (optionType) {
            case ApplicationCommandOptionType.String:
                toReturn.addStringOption(value as SlashCommandStringOption)
                break;
            case ApplicationCommandOptionType.Integer:
                toReturn.addIntegerOption(value as SlashCommandIntegerOption)
                break;
            case ApplicationCommandOptionType.Boolean:
                toReturn.addBooleanOption(value as SlashCommandBooleanOption)
                break;
            case ApplicationCommandOptionType.User:
                toReturn.addUserOption(value as SlashCommandUserOption)
                break;
            case ApplicationCommandOptionType.Channel:
                toReturn.addChannelOption(value as SlashCommandChannelOption)
                break;
            case ApplicationCommandOptionType.Role:
                toReturn.addRoleOption(value as SlashCommandRoleOption)
                break;
            case ApplicationCommandOptionType.Mentionable:
                toReturn.addMentionableOption(value as SlashCommandMentionableOption)
                break;
            case ApplicationCommandOptionType.Number:
                toReturn.addNumberOption(value as SlashCommandNumberOption)
                break;
            case ApplicationCommandOptionType.Attachment:
                toReturn.addAttachmentOption(value as SlashCommandAttachmentOption)
                break;

            default:
                break;
        }
    });
    return toReturn;
}