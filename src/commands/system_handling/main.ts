import { SlashCommandBuilder, ChatInputCommandInteraction, SlashCommandSubcommandBuilder, ActionRowBuilder, ButtonStyle, ButtonBuilder } from 'discord.js';
// TODO : Add a way to find lang files and use them directly without importing them all to the code
import enUsJson from '../../../res/en-us.json';
import frJson from '../../../res/fr.json';
import { createButton, createEmbed, createFullEmbed } from '../../globalCommands';
import { image } from '../../../conf/embedDefaults.json'

export const data = new SlashCommandBuilder()
                        .setName('system')
                        .setDescription(enUsJson.commands.system.description)
                        .setDescriptionLocalizations({ 'fr': frJson.commands.system.description })
                        .addSubcommand(new SlashCommandSubcommandBuilder()
                                        .setName('help')
                                        .setDescription(enUsJson.commands.system.subcommands.help.description)
                                        .setDescriptionLocalizations({ 'fr': frJson.commands.system.subcommands.help.description }))
export async function execute(interaction: ChatInputCommandInteraction) {
    const subCommand = interaction.options.getSubcommand(false);
    if (subCommand != '') {
        switch (subCommand) {
            case 'help':
                const informationsEmbed = createFullEmbed(
                    'Informations',
                    `Hello ^^! I'm Validity and I'm a Discord(TM) bot designed for
                    plural systems/teams/communities/etc, allowing you to register a system,
                    members of this system, groups, etc.`, image).addFields(
                        {
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
                        }
                    );
                const systemSubCommandsEmbed = createEmbed(
                    'System subcommands').addFields(
                        { 'name': 'Help subcommand', 'value': '`/system help`\nIt give this embed!' });


                let informationsButton = createButton('\u2139', ButtonStyle.Secondary, 'Bot informations').setCustomId('info');
                let systemSubCommandsButton = createButton('📜', ButtonStyle.Primary, 'System subcommands').setCustomId('syssubcom');


                const buttons = new ActionRowBuilder().addComponents(
                        informationsButton, systemSubCommandsButton
                    ) as ActionRowBuilder<ButtonBuilder>;
                interaction.reply({
                    embeds: [ systemSubCommandsEmbed ],
                    components: [ buttons ],
                });

                const collector = interaction.channel?.createMessageComponentCollector();

                collector?.on('collect', collectorInteraction => {

                    switch (collectorInteraction.customId) {
                        case 'info':
                            try {

                                informationsButton = informationsButton.setStyle(ButtonStyle.Primary);
                                systemSubCommandsButton = systemSubCommandsButton.setStyle(ButtonStyle.Secondary);

                                const newButtons = new ActionRowBuilder().addComponents(
                                    informationsButton, systemSubCommandsButton
                                ) as ActionRowBuilder<ButtonBuilder>;

                                collectorInteraction.update({
                                    embeds: [ informationsEmbed ],
                                    components: [ newButtons ]
                                });

                            } catch (error) {
                                console.error(error);
                            }
                            break;
                        
                        case 'syssubcom':
                            try {

                                informationsButton = informationsButton.setStyle(ButtonStyle.Secondary);
                                systemSubCommandsButton = systemSubCommandsButton.setStyle(ButtonStyle.Primary);

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
                break;
        }
    }
}