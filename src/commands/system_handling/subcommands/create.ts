import { ChatInputCommandInteraction, SlashCommandSubcommandBuilder } from 'discord.js'
import enUsJson from '../../../../res/en-us.json'
import frJson from '../../../../res/fr.json'
import { System } from '../../../classes/systemHandling/System'
import { generateUID, getUrlResponse, saveDatabase, stringOptionNormalize } from '../../../globalMethods'

export const data = new SlashCommandSubcommandBuilder()
    .setName('create')
    .setDescription(enUsJson.commands.system.subcommands.create.description)
    .setDescriptionLocalizations({ fr: frJson.commands.system.subcommands.create.description })
    .addStringOption((option) => option
        .setName('name')
        .setRequired(true)
        .setDescription(enUsJson.commands.system.subcommands.create.optionsDesc.name)
        .setDescriptionLocalizations({ fr: frJson.commands.system.subcommands.create.optionsDesc.name }))
    .addStringOption((option) => option
        .setName('color')
        .setDescription(enUsJson.commands.system.subcommands.create.optionsDesc.color)
        .setDescriptionLocalizations({ fr: frJson.commands.system.subcommands.create.optionsDesc.color }))
    .addStringOption((option) => option
        .setName('description')
        .setDescription(enUsJson.commands.system.subcommands.create.optionsDesc.description)
        .setDescriptionLocalizations({ fr: frJson.commands.system.subcommands.create.optionsDesc.description }))
    .addStringOption((option) => option
        .setName('avatar-url')
        .setDescription(enUsJson.commands.system.subcommands.create.optionsDesc.avatarUrl)
        .setDescriptionLocalizations({ fr: frJson.commands.system.subcommands.create.optionsDesc.avatarUrl }))
    .addAttachmentOption((option) => option
        .setName('avatar-attachment')
        .setDescription(enUsJson.commands.system.subcommands.create.optionsDesc.avatarAttachment)
        .setDescriptionLocalizations({ fr: frJson.commands.system.subcommands.create.optionsDesc.avatarAttachment }));

export async function execute(interaction: ChatInputCommandInteraction): Promise<[InteractionReplyError, any]> {
    const systemsData = require('../../../../data/data.json');
    var interactionReplyErrors = [] as InteractionReplyError[];
    var tooLongNumber = undefined;
    var avatarUrl: string | undefined;

    systemsData.systems.forEach((element: System) => {
        const userIDs = element.userIDs;
        for(let i = 0; i < userIDs.length; i++) {            
            if (userIDs[i] == interaction.user.id) interactionReplyErrors.push(InteractionReplyError.AlreadyExists);
        }
    });
    const nameOption = stringOptionNormalize(interaction, 'name', true) as string;
    const colorOption = stringOptionNormalize(interaction, 'color');
    const avatarUrlOption = stringOptionNormalize(interaction, 'avatar-url');
    const avatarAttachmentOption = interaction.options.getAttachment('avatar-attachment', false);
    const descOption = stringOptionNormalize(interaction, 'description');
    
    if (nameOption.length > 64) {
        interactionReplyErrors.push(InteractionReplyError.NameIsTooLong);
        tooLongNumber = nameOption.length;
    }

    if (colorOption) {
        if (!/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(colorOption)) interactionReplyErrors.push(InteractionReplyError.NotHexColor);
    }

    if (descOption) {
        if (descOption.length > 1024) {
            interactionReplyErrors.push(InteractionReplyError.DescIsTooLong);
            tooLongNumber = descOption.length;
        }
    }

    if (avatarUrlOption != null && avatarAttachmentOption != undefined) interactionReplyErrors.push(InteractionReplyError.BothUrlAndAttachment);
    if (avatarAttachmentOption) {
        if (!avatarAttachmentOption.contentType || !avatarAttachmentOption.contentType?.startsWith('image/')) interactionReplyErrors.push(InteractionReplyError.AvatarAttachmentWrongType);
            interactionReplyErrors.push(await getUrlResponse(avatarAttachmentOption.url, InteractionReplyError.AvatarAttachment404, InteractionReplyError.AvatarAttachmentIsBroken));
            avatarUrl = avatarAttachmentOption.url;
    }

    if (avatarUrlOption) {
        interactionReplyErrors.push(await getUrlResponse(avatarUrlOption, InteractionReplyError.AvatarUrl404, InteractionReplyError.AvatarUrlIsBroken));
        avatarUrl = avatarUrlOption;
    }

    for(let i = 0; i < interactionReplyErrors.length; i++) {
        if (!interactionReplyErrors[i]) {
            interactionReplyErrors.splice(i, 1);
        }
    }

    if (interactionReplyErrors.length === 0) {
        let system = new System(generateUID(), [ interaction.user.id ], colorOption, avatarUrl, undefined, nameOption, descOption);
        const newSystemData: any = systemsData;
        (newSystemData.systems as any[]).push(system.toJson());
        let savingResult = saveDatabase(JSON.stringify(newSystemData))
        interactionReplyErrors.push(savingResult);
    }
    console.log(interactionReplyErrors);
    return [interactionReplyErrors[0], tooLongNumber];
}


export enum InteractionReplyError {

    NoError,



    AlreadyExists,


    
    NameIsTooLong,
    NotHexColor,
    DescIsTooLong,



    BothUrlAndAttachment,

    AvatarUrl404,
    AvatarUrlIsBroken,

    AvatarAttachmentWrongType,
    AvatarAttachment404,
    AvatarAttachmentIsBroken ,



    SavingError
}