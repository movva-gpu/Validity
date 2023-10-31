import { REST, RESTPutAPIApplicationCommandsResult, RequestData, Routes, SlashCommandBuilder } from 'discord.js';
import fs from 'node:fs';
import path from 'node:path';

const { clientId, token } = require('../conf/conf.json');

const commands = [];
const foldersPath = path.join(import.meta.dir, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
	const commandFiles = fs.readdirSync(foldersPath).filter((file: string) => file.endsWith('.ts') || file.endsWith('.cjs'));
	for (const file of commandFiles) {
		const filePath = path.join(foldersPath, file);
		const command = require(filePath);
		if ('data' in command && 'execute' in command) {
			commands.push(command.data.toJSON());
		} else {
			console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
		}
	}
}

const rest = new REST().setToken(token);

(async () => {
	try {
		console.log(`Started refreshing ${commands.length} application (/) commands.`);

		const data = await rest.put(
			Routes.applicationCommands(clientId),
			{ body: commands },
		);
		console.log(`Successfully reloaded ${(data as RESTPutAPIApplicationCommandsResult).length} application (/) commands.`);
	} catch (error) {
		console.error(error);
	}
})();

// TODO: Rewrite the file manually to ensure everything has been understood :)!