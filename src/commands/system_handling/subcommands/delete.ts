import { ChatInputCommandInteraction, Locale, MessageCollector, SlashCommandSubcommandBuilder } from 'discord.js'

import { getLangsData, readDatabase, userHasSystem } from '../../../global_methods'
import { SystemError } from '../system'

const langs = getLangsData();

export const data = new SlashCommandSubcommandBuilder()
    .setName('delete')
    .setDescription(langs['en-US'].commands.system.subcommands?.delete.description as string);
    for (const locale in langs) { data.setDescriptionLocalization(locale as Locale,
        langs[locale].commands.system.subcommands?.delete.description as string) }

export async function execute(interaction: ChatInputCommandInteraction): Promise<number | void | MessageCollector> {
    if (!userHasSystem(interaction.user, readDatabase() ?? require('../../../../data/data.json'))) return SystemError.NoUserSys;

    if (!interaction.channel) return NaN;
    return interaction.channel.createMessageCollector({ time: 60_000, max: 1, filter: (m) => m.author.id === interaction.user.id });
}