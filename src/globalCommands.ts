import { ButtonBuilder, ButtonStyle, ColorResolvable, ComponentEmojiResolvable, EmbedBuilder } from "discord.js";
import * as embedDefaults from '../conf/embedDefaults.json'

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
    let UUID = '';
    for (let i = 0; i < UUIDLength - 1; i++) {
        UUID += generateToken(tokensLength) + '-';
    }
    return UUID += generateToken(tokensLength);
}



export function createFullEmbed(title: string, description: string | null = null, thumbnail: string | null = null,
                                image: string | null = null, url: string | null = null, footer = embedDefaults.footer,
                                color = embedDefaults.color as ColorResolvable): EmbedBuilder {
    return new EmbedBuilder()
        .setColor(color)
        .setTitle(title)
        .setThumbnail(thumbnail)
        .setURL(url)
        .setDescription(description)
        .setImage(image)
        .setFooter({
            text: footer,
            iconURL: embedDefaults.image
        });
}

export function createEmbed(title: string, description: string | null = null, url: string | null = null,
                            footer = embedDefaults.footer, color = embedDefaults.color as ColorResolvable): EmbedBuilder {
    return new EmbedBuilder()
        .setColor(color)
        .setTitle(title)
        .setURL(url)
        .setDescription(description)
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