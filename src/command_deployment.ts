import { REST, RESTPutAPIApplicationCommandsResult, Routes } from 'discord.js'
import fs from 'fs'
import path from 'path'

import { clientId, token } from '../conf/clientConf.json'


export function deployCommands(): void {
    let i = 0;
    const commandPath = path.join(import.meta.dir, 'commands');
    let commandFilesAndSubFolders = fs.readdirSync(commandPath);
    while (i < commandFilesAndSubFolders.length || i >= 100 || i <= -100) {
        let maybeFolder = Bun.file(path.join(commandPath, commandFilesAndSubFolders[i]));
        let folderContent: string[] = [];
        let folderOrFileName = commandFilesAndSubFolders[i];
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

    const commands = [];
    const commandFiles = commandFilesAndSubFolders.filter((file: string) => file.endsWith('.cjs') || file.endsWith('.ts'));

    for (const file of commandFiles) {
        const filePath = path.join(commandPath, file);
        const command = require(filePath);
        if ('data' in command && 'execute' in command) {
            commands.push(command.data.toJSON());
        } else {
            console.warn(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
        }
    }

    const rest = new REST().setToken(token);

    (async () => {
        try {
            console.info(`[INFO] Started refreshing ${commands.length} application (/) commands.`);

            const data = await rest.put(
                Routes.applicationCommands(clientId),
                { body: commands });

            console.info(`[INFO] Successfully reloaded ${(data as RESTPutAPIApplicationCommandsResult).length}
                        application (/) commands.`);
        } catch (error) {
            console.error(error);
        }
    })();
}