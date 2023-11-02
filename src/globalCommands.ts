import {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    ChatInputCommandInteraction,
    ColorResolvable,
    ComponentEmojiResolvable,
    EmbedBuilder,
    InteractionReplyOptions
} from "discord.js" // TODO: Maybe make shorter aliases (see answers on DiscordJS server)

import { InitialMainButton } from "./enums"
import * as embedDefaults from '../conf/embedDefaults.json'
import { image } from '../conf/embedDefaults.json'

export function generateToken(length = 5): string {
    const authorizedChars = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let token = '';
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * authorizedChars.length);
        token += authorizedChars.charAt(randomIndex);
    }
    return token;
}

export function generateUUID(UUIDLength = 6, tokensLength = 5): string {
    let uuid = '';
    for (let i = 0; i < UUIDLength - 1; i++) {
        uuid += generateToken(tokensLength) + '-';
    }
    return uuid += generateToken(tokensLength);
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

export function createButton(emoji: ComponentEmojiResolvable, style: ButtonStyle, label: string): ButtonBuilder {
    return new ButtonBuilder()
        .setEmoji(emoji)
        .setStyle(style)
        .setLabel(label);
}

export function invokeHelpEmbed(initialMainButton: InitialMainButton,interaction: ChatInputCommandInteraction): void {
    const informationsEmbed = createFullEmbed(
        'Informations',
        `Hello ^^! I'm Validity and I'm a Discord(TM) bot designed for plural systems/teams/communities/etc,
        allowing you to register a system, members of this system, groups, etc.`, image)
            .addFields({
                'name': 'What are "plural systems"?',
                'value': `According to [Pluralpedia](https://pluralpedia.org/w/Plurality),
                a system is the collection of people and entities, often called headmates or alters,
                that share a single physical plural body.` 
            },
            {
                'name': 'What is this bot for?',
                'value': `It serves the exact same use as [PluralKit](https://pluralkit.me),
                depending on a defined tag, called a proxy, a message will be replaced by a fake account,
                with the name and the avatar defined by the member.`
            });
    const systemSubCommandsEmbed = createEmbed(
        'System subcommands').addFields(
            { 'name': 'Help subcommand', 'value': '`/system help`\nIt give this embed!' });
    
    const informationsButton = createButton('\u2139', ButtonStyle.Secondary, 'Bot informations')
        .setCustomId('info');
    const systemSubCommandsButton = createButton('📜', ButtonStyle.Secondary, 'System subcommands')
        .setCustomId('syssubcom');
    
    switch (initialMainButton) {
        case 0:
            informationsButton.setStyle(ButtonStyle.Primary)
            break;
        
        case 1:
            systemSubCommandsButton.setStyle(ButtonStyle.Primary)
    
        default:
            break;
    }
    
    
    const buttons = new ActionRowBuilder().addComponents(
            informationsButton, systemSubCommandsButton
        ) as ActionRowBuilder<ButtonBuilder>;

    const messageOptions = {
        embeds: [] as EmbedBuilder[],
        components: [ buttons ]
    } as InteractionReplyOptions;

    switch (initialMainButton) {
        case 0:
            messageOptions.embeds = [ informationsEmbed ];
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
    
                    informationsButton.setStyle(ButtonStyle.Primary);
                    systemSubCommandsButton.setStyle(ButtonStyle.Secondary);
    
                    const newButtons = new ActionRowBuilder().addComponents(
                        informationsButton, systemSubCommandsButton
                    ) as ActionRowBuilder<ButtonBuilder>;
    
                    await collectorInteraction.update({
                        embeds: [ informationsEmbed ],
                        components: [ newButtons ]
                    });
    
                } catch (error) {
                    console.error(error);
                }
                break;
            
            case 'syssubcom':
                try {
    
                    informationsButton.setStyle(ButtonStyle.Secondary);
                    systemSubCommandsButton.setStyle(ButtonStyle.Primary);
    
                    const newButtons = new ActionRowBuilder().addComponents(
                        informationsButton, systemSubCommandsButton
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