import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js"
import enUsJson from '../../res/en-us.json'
import frJson from '../../res/fr.json'
import { invokeHelpEmbed } from "../globalMethods"

export const data = new SlashCommandBuilder()
    .setName('info')
    .setDescription(enUsJson.commands.info.description)
    .setDescriptionLocalizations({ fr: frJson.commands.info.description });

export function execute(interaction: ChatInputCommandInteraction): void {
    invokeHelpEmbed(0, interaction);
}