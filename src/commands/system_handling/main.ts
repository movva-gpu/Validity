import { SlashCommandBuilder, ChatInputCommandInteraction, SlashCommandSubcommandBuilder } from 'discord.js'
// TODO : Add a way to find lang files and use them directly without importing them all to the code
import enUsJson from '../../../res/en-us.json'
import frJson from '../../../res/fr.json'
import { invokeHelpEmbed } from '../../globalMethods'
import * as create from './subcommands/create'

export const data = new SlashCommandBuilder()
    .setName('system')
    .setDescription(enUsJson.commands.system.description)
    .setDescriptionLocalizations({ 'fr': frJson.commands.system.description })
    .addSubcommand(new SlashCommandSubcommandBuilder()
        .setName('help')
        .setDescription(enUsJson.commands.system.subcommands.help.description)
        .setDescriptionLocalizations({ 'fr': frJson.commands.system.subcommands.help.description }))
    .addSubcommand(create.data);
export async function execute(interaction: ChatInputCommandInteraction) {
    const subCommand = interaction.options.getSubcommand(false);
    if (subCommand != '') {
        switch (subCommand) {
            case 'help':
                    invokeHelpEmbed(1, interaction);
                break;
            case 'create':
                const error = await create.execute(interaction);
                switch (error) {
                    case create.InteractionReplyError.NoError:
                        interaction.reply('The system was successfuly created! :)');
                        break;

                    case create.InteractionReplyError.AlreadyExists:
                        interaction.reply('Error: It seems you already have a system :/');
                        break;
                    
                    case create.InteractionReplyError.NameIsTooLong:
                        interaction.reply('Error: Heyy! The maximum length for your system\'s name is 64 characters! >:0');
                        break;
                        
                    case create.InteractionReplyError.NotHexColor:
                        interaction.reply('Error: The color must begin with # and contain 3 or 6 characters! :3');
                        break;
                        
                    case create.InteractionReplyError.DescIsTooLong:
                        interaction.reply('Error: Wow! The description you provided is way to looong :0 The maximum size is of 1024 characters! ^^\'');
                        break;

                    case create.InteractionReplyError.BothUrlAndAttachment:
                        interaction.reply('Error: @_@ Attachment or URL? Attachment or URL?? I can only be provided one!');
                        break;
                    
                    case create.InteractionReplyError.AvatarUrl404:
                        interaction.reply('Error 404: I can\'t access the image your provided me! Maybe you made a typo?');
                        break;
                        
                    case create.InteractionReplyError.AvatarUrlIsBroken:
                        interaction.reply('Error: You link seems to be unusable! Maybe you made a typo?');
                        break;

                    case create.InteractionReplyError.AvatarAttachmentWrongType:
                        interaction.reply('Error: The file you provided me isn\'t an image!');
                        break;

                    case create.InteractionReplyError.AvatarAttachment404:
                        interaction.reply('Error: Something seems to be wrong with the attachment! Try again later :p');
                        break;
                    
                    case create.InteractionReplyError.AvatarAttachmentIsBroken:
                        interaction.reply('Error: Something seems to be wrong with the attachment! Try again later :p');
                        break;
                        
                    case create.InteractionReplyError.SavingError:
                        interaction.reply('Error: Error while saving your file to the database, please [report the issue on github](https://github.com/movva-gpu/ValidityRE/issues/new?title=[DATABASE%20SAVING]&body=(Please%20put%20the%20command%20you%20input%20here))!');
                        break;
                }
        }
    }
}