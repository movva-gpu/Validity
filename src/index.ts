import { ActivityType, Client, Collection, Events, GatewayIntentBits, SlashCommandBuilder } from 'discord.js';
const fs = require('node:fs');
const path = require('node:path');
const { token } = require('../conf/conf.json');



class ClientWithCommands extends Client {
    public commands = new Collection<string, Command>();
}

type Command = {
    data: SlashCommandBuilder
    execute(arg1: any, arg2: any): Promise<void>
}



const client = new  ClientWithCommands({ intents: [GatewayIntentBits.Guilds] });

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

    const command = (interaction.client as ClientWithCommands).commands.get(interaction.commandName);
    console.log(client.ws.ping);
    switch (interaction.commandName) {
        case 'ping':
            command?.execute(interaction, client.ws.ping);
            break;
    
        default:
            break;
    }
});



client.login(token);
