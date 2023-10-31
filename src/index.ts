import { ActivityType, Events, GatewayIntentBits } from 'discord.js';
import { ValidityClient } from './classes/ValidityClient';
import fs from 'node:fs';
import path from 'node:path';

const { token } = require('../conf/conf.json');

const client = new ValidityClient({ intents: [GatewayIntentBits.Guilds] });



client.once(Events.ClientReady, c => {
    console.log('Hello discord.js!\nI\'m logged in as ' + client.user?.tag + '!');
    client.user?.setActivity({ name: 'Trying to understand iself.', type: ActivityType.Playing, state: 'online' });

    const commandsPath = path.join(import.meta.dir, 'commands');
    const commandFiles = fs.readdirSync(commandsPath).filter((file: string) => file.endsWith('.cjs') || file.endsWith('.ts'));

    for (const file of commandFiles) {
        const filePath = path.join(commandsPath, file);
        const command = require(filePath);
        console.log('[INFO] I have all these commands: ', commandFiles);
        if ('data' in command && 'execute' in command) {
            client.commands.set(command.data.name, command);
        } else {
            console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
        }
    }
});



client.on(Events.InteractionCreate, async interaction => {
    if (!interaction.isChatInputCommand()) return;

    const command = (interaction.client as ValidityClient).commands.get(interaction.commandName);
    console.log(client.ws.ping);
    switch (interaction.commandName) {
        case 'ping':
            command?.execute(interaction, client.ws.ping);
            break;
    
        default:
            break;
    }
});



export function generateToken(length = 5): string {
    const authorizedChars = 'abcdefghijklmnopqrstuvwxyz0123456789'
    let token = '';
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * authorizedChars.length);
        token += authorizedChars.charAt(randomIndex);
    }
    return token;
}

export function generateUUID(UUIDLength = 6, tokensLength = 5): string {
    let UUID = '';
    for (let i = 0; i < UUIDLength - 1; i++) {
        UUID += generateToken(tokensLength) + '-'
    }
    return UUID += generateToken(tokensLength);
}



client.login(token);