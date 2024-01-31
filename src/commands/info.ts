import {
    ChatInputCommandInteraction,
    Locale,
    SlashCommandBuilder,
} from 'discord.js';

import { InitialHelpEmbedButton, invokeHelpEmbed } from '../global_methods';
import { langs } from '..';

export const data = new SlashCommandBuilder()
    .setName('info')
    .setDescription(langs['en-US'].commands.info.description);

for (const locale in langs) {
    data.setDescriptionLocalization(
        locale as Locale,
        langs[locale].commands.info.description as string
    );
}

export function execute(interaction: ChatInputCommandInteraction): void {
    invokeHelpEmbed(InitialHelpEmbedButton.Information, interaction);
}
