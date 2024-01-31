import { ActivityType, Events, GatewayIntentBits } from 'discord.js';
import * as fs from 'fs';
import * as path from 'path';

import { ValidityClient } from './classes/ValidityClient';
import { token } from '../conf/clientConf.json';
import { getLangsData } from './global_methods';
import { deployCommands } from './command_deployment';

const parrotSay = require('parrotsay-api'); // More about it here : https://github.com/matheuss/parrotsay-api

const client = new ValidityClient({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages],
});

export const langs = getLangsData(true);

client.once(Events.ClientReady, async (c) => {
    console.log('\n\n'); // To center the *parrot*

    await parrotSay(
        "\n  Hello discord.js! I'm logged in as " + client.user?.tag + '!   \n'
    )
        .then(console.info)
        .catch(console.error);
    client.user?.setActivity({
        name: 'Trying to understand itself.',
        type: ActivityType.Playing,
        state: 'online',
    });
    //  client.user?.setAvatar(avatarUrl);

    let i = 0;
    const commandPath = path.join(import.meta.dir, 'commands');
    let commandFilesAndSubFolders = fs.readdirSync(commandPath);
    while (i < commandFilesAndSubFolders.length || i >= 100 || i <= -100) {
        const maybeFolder = Bun.file(
            path.join(commandPath, commandFilesAndSubFolders[i])
        );
        const folderOrFileName = commandFilesAndSubFolders[i];
        let folderContent: string[] = [];

        if (
            maybeFolder.type === 'application/octet-stream' &&
            !maybeFolder.name?.endsWith('subcommands')
        ) {
            folderContent = fs.readdirSync(
                path.join(commandPath, folderOrFileName)
            );
            for (let y = 0; y < folderContent.length; y++) {
                folderContent[y] = path.join(
                    folderOrFileName,
                    folderContent[y]
                );
            }
            commandFilesAndSubFolders.splice(i, 1);
        }

        i++;
        commandFilesAndSubFolders =
            commandFilesAndSubFolders.concat(folderContent);
    }
    const commandFiles = commandFilesAndSubFolders.filter(
        (file: string) => file.endsWith('.cjs') || file.endsWith('.ts')
    );

    for (const file of commandFiles) {
        const filePath = path.join(commandPath, file);
        const command = require(filePath);
        if ('data' in command && 'execute' in command) {
            client.commands.set(command.data.name, command);
        } else {
            console.warn(
                `[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`
            );
        }
    }
    console.info('[INFO] I have all these commands:', commandFiles);

    if (process.argv.filter((item) => item === '--deploy-commands').length != 0)
        deployCommands();
});

client.on(Events.InteractionCreate, async (interaction) => {
    if (!interaction.isChatInputCommand()) return;
    console.log('[INFO] Slash Command received!');

    const command = (interaction.client as ValidityClient).commands.get(
        interaction.commandName
    );

    switch (interaction.commandName) {
        case 'ping':
            command?.execute(interaction, client.ws.ping);
            break;

        default:
            command?.execute(interaction);
            break;
    }
});

client.login(token);

export interface LangData {
    [locale: string]: {
        commands: {
            [command: string]: {
                description: string;
                subcommands?: {
                    [subcommand: string]: {
                        description: string;
                        options?: { [option: string]: string };
                        response?: string;
                        responses?: { [response: string]: string };
                        specific?: string;
                        success: string;
                        labels?: { [label: string]: string };
                    };
                };
                response?: string;
                responses?: { [response: string]: string };
                labels?: { [label: string]: string };
            };
        };
        [key: string]: unknown;
    };
}
