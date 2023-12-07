import {
    ActionRowBuilder,
    ChatInputCommandInteraction,
    Locale,
    ModalBuilder,
    ModalSubmitInteraction,
    SlashCommandSubcommandBuilder,
    TextInputBuilder
} from "discord.js"

import { getUserSystemIndex, saveDatabase, userHasSystem } from "../../../globalMethods"

import { SystemsDataType } from "../main";
import { langs } from "../../..";



export const data = new SlashCommandSubcommandBuilder()
    .setName('delete')
    .setDescription(langs['en-US'].commands.system.subcommands?.delete.description as string);
    for (const locale in langs) {
        data.setDescriptionLocalization(locale as Locale, langs[locale].commands.system.subcommands?.delete.description as string);
};



export async function execute(interaction: ChatInputCommandInteraction): Promise<SystemDeleteInteractionReplyError> {

    var deleteLabels = langs['en-US'].commands.system.subcommands?.delete.labels as any;
    if (langs[interaction.locale]?.commands.system.subcommands?.delete.labels) deleteLabels = langs[interaction.locale].commands.system.subcommands?.delete.labels as any;

    const systemsData: SystemsDataType = require('../../../../data/data.json');


    if (!userHasSystem(interaction.user, systemsData)) return SystemDeleteInteractionReplyError.UserHasNoSys;


    const replyChoice = new TextInputBuilder()
        .setCustomId('reply')
        .setPlaceholder(deleteLabels.textInput.placeholder)
        .setLabel(deleteLabels.textInput.title)
        .setRequired(true)
        .setStyle(1) // TextInputStyle.Short
        .setMaxLength(64);

    const actionRow = new ActionRowBuilder() as ActionRowBuilder<TextInputBuilder>;
    actionRow.addComponents(replyChoice);
    const modal = new ModalBuilder()
        .setTitle(deleteLabels.modalTitle)
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