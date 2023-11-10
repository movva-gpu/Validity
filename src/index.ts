import { ActivityType, Events, GatewayIntentBits } from 'discord.js'
import { ValidityClient } from './classes/ValidityClient'
import * as fs from 'fs'
import * as path from 'path'
import { token, avatarUrl } from '../conf/clientConf.json'
import { getLangsData } from './globalMethods'
import { deployCommands } from './command-deployment'

const client = new ValidityClient({ intents: [GatewayIntentBits.Guilds] });

export const langs = getLangsData(true);
// console.log(langs);



client.once(Events.ClientReady, c => {
    console.log('Hello discord.js!\nI\'m logged in as ' + client.user?.tag + '!');
    client.user?.setActivity({ name: 'Trying to understand iself.', type: ActivityType.Playing, state: 'online' });
//    client.user?.setAvatar(avatarUrl);

    let i = 0;
    const commandPath = path.join(import.meta.dir, 'commands');
    let commandFilesAndSubFolders = fs.readdirSync(commandPath);
    while (i < commandFilesAndSubFolders.length || i >= 100 || i <= -100) {
        const maybeFolder = Bun.file(path.join(commandPath, commandFilesAndSubFolders[i]));
        const folderOrFileName = commandFilesAndSubFolders[i];
        let folderContent: string[] = [];

        if (maybeFolder.type === 'application/octet-stream' && !maybeFolder.name?.endsWith('subcommands')) {

            folderContent = fs.readdirSync(path.join(commandPath, folderOrFileName));
            for (let y = 0; y < folderContent.length; y++) {
                folderContent[y] = path.join(folderOrFileName, folderContent[y]);
            }
            commandFilesAndSubFolders.splice(i, 1);

        }

        i++;
        commandFilesAndSubFolders = commandFilesAndSubFolders.concat(folderContent);
    }
    const commandFiles = commandFilesAndSubFolders.filter((file: string) => file.endsWith('.cjs') || file.endsWith('.ts'));

    for (const file of commandFiles) {
        const filePath = path.join(commandPath, file);
        const command = require(filePath);
        if ('data' in command && 'execute' in command) {
            client.commands.set(command.data.name, command);
        } else {
            console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
        }
    }
    console.log('[INFO] I have all these commands:', commandFiles);

    // deployCommands();
});



client.on(Events.InteractionCreate, async interaction => {
    if (!interaction.isChatInputCommand()) return;
    console.log('[INFO] Slash Command received!');
    
    
    const command = (interaction.client as ValidityClient).commands.get(interaction.commandName);

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
                        options?: {
                            [option: string]: string;
                        }
                    }
                }
                response?: string;
                responses?: {
                    [response: string]: string
                }
            }
        }
    }
}