import {
    ActionRowBuilder,
    ChatInputCommandInteraction,
    ModalBuilder,
    ModalSubmitInteraction,
    SlashCommandSubcommandBuilder,
    TextInputBuilder
} from "discord.js"

import { getUserSystemIndex, saveDatabase, userHasSystem } from "../../../globalMethods"

import enUsJson from '../../../../res/en-us.json'
import frJson from '../../../../res/fr.json'
import { SystemsDataType } from "../main";

export const data = new SlashCommandSubcommandBuilder()
    .setName('delete')
    .setDescription(enUsJson.commands.system.subcommands.delete.description)
    .setDescriptionLocalizations({ fr: frJson.commands.system.subcommands.delete.description });

export async function execute(interaction: ChatInputCommandInteraction): Promise<SystemDeleteInteractionReplyError> {
    const systemsData: SystemsDataType = require('../../../../data/data.json');

    if (!userHasSystem(interaction.user, systemsData)) return SystemDeleteInteractionReplyError.UserHasNoSys;

    const replyChoice = new TextInputBuilder()
        .setCustomId('reply')
        .setPlaceholder('Input your system\'s name to delete your system')
        .setLabel('System name')
        .setRequired(true)
        .setStyle(1) // TextInputStyle.Short
        .setMaxLength(64);

    const actionRow = new ActionRowBuilder() as ActionRowBuilder<TextInputBuilder>;
    actionRow.addComponents(replyChoice);
    const modal = new ModalBuilder()
        .setTitle('Do you really wanna do that?')
        .setCustomId('replyModal');
    modal.addComponents(actionRow);
    
    await interaction.showModal(modal);
    
    let toReturn = SystemDeleteInteractionReplyError.UnknownError;
    const filter = (interaction: ModalSubmitInteraction) => interaction.customId === 'replyModal';
    await interaction.awaitModalSubmit({ filter, time: 3*60*1000 })
        .then((interaction) => {
            var systemIndex = getUserSystemIndex(interaction.user, systemsData)
            if (systemIndex == -1) toReturn = SystemDeleteInteractionReplyError.UserHasNoSys; // Cannot happen normally
            systemsData.systems.splice(systemIndex, 1);
            toReturn = saveDatabase(systemsData, SystemDeleteInteractionReplyError.SavingError, SystemDeleteInteractionReplyError.NoError);
        }).catch(error => {
            console.error(error);
            toReturn = SystemDeleteInteractionReplyError.Timeout;
        });

        return toReturn;
}

export enum SystemDeleteInteractionReplyError {
    NoError,

    UserHasNoSys,

    Timeout,

    SavingError,

    UnknownError
}