import { SlashCommandBuilder, ChatInputCommandInteraction, SlashCommandSubcommandBuilder } from 'discord.js'
// TODO : Add a way to find lang files and use them directly without importing them all to the code
import enUsJson from '../../../res/en-us.json'
import frJson from '../../../res/fr.json'
import { InitialHelpEmbedButton, invokeHelpEmbed } from '../../globalMethods'
import * as create from './subcommands/create'
import * as deleteCommand from './subcommands/delete'
import { System } from '../../classes/systemHandling/System'

export type SystemsDataType = {
    systems: System[]
}

export const data = new SlashCommandBuilder()
    .setName('system')
    .setDescription(enUsJson.commands.system.description)
    .setDescriptionLocalizations({ 'fr': frJson.commands.system.description })
    .addSubcommand(new SlashCommandSubcommandBuilder()
        .setName('help')
        .setDescription(enUsJson.commands.system.subcommands.help.description)
        .setDescriptionLocalizations({ 'fr': frJson.commands.system.subcommands.help.description }))
    .addSubcommand(create.data)
    .addSubcommand(deleteCommand.data);
export async function execute(interaction: ChatInputCommandInteraction) {
    const subCommand = interaction.options.getSubcommand(false);
    if (subCommand != '') {
        switch (subCommand) {
            case 'help':
                    invokeHelpEmbed(InitialHelpEmbedButton.SystemSubCommands, interaction);
                break;
            case 'create':
                    create.execute(interaction).then(error => {
                        switch (typeof error) {
                            case 'number':
                                switch (error) {
                                    case create.SystemCreateInteractionReplyError.NoError:
                                        interaction.reply('The system was successfuly created! :) :white_check_mark:');
                                        break;

                                    case create.SystemCreateInteractionReplyError.AlreadyExists:
                                        interaction.reply('Error: It seems you already have a system :/ :x:');
                                        break;

                                    case create.SystemCreateInteractionReplyError.NotHexColor:
                                        interaction.reply('Error: The color must begin with # and contain 3 or 6 characters! :3 :x:');
                                        break;

                                    case create.SystemCreateInteractionReplyError.AvatarUrl404:
                                        interaction.reply('Error 404: I can\'t access the image your provided me! Maybe you made a typo? :x:');
                                        break;

                                    case create.SystemCreateInteractionReplyError.AvatarUrlIsBroken:
                                        interaction.reply('Error: You link seems to be unusable! Maybe you made a typo? :x:');
                                        break;

                                    case create.SystemCreateInteractionReplyError.AvatarWrongType:
                                        interaction.reply('Error: The link you gave isn\'t an image! :x:')
                                        break;

                                    case create.SystemCreateInteractionReplyError.SavingError:
                                        interaction.reply('Error: Error while saving your file to the database. :x:\nPlease [report the issue on github](https://github.com/movva-gpu/ValidityRE/issues/new?title=[DATABASE%20SAVING]&body=(Please%20put%20the%20command%20you%20input%20here))! :arrow_left:');
                                        break;

                                    default:
                                        console.log('Wtf');
                                        break;
                                }
                                break;

                            case 'object':
                                switch(error[0]) {
                                    case create.SystemCreateInteractionReplyError.NameIsTooLong:
                                        interaction.reply(`Error: Heyy! The maximum length for your system's name is 64 characters! >:0 (${error[1]}/64) :x:`);
                                        break;

                                    case create.SystemCreateInteractionReplyError.DescIsTooLong:
                                        interaction.reply(`Error: Wow! The description you provided is way to looong :0 The maximum size is of 1024 characters! ^^' (${error[1]}/1024) :x:`);
                                        break;
                                }
                                break;
                    }});
                break;
            case 'delete':
                console.log(await deleteCommand.execute(interaction));
                break;
        }
    }
}