import { Client, Collection } from 'discord.js'
import { System } from './systemHandling/System'
import { Command } from './Command'

export class ValidityClient extends Client {
    public commands = new Collection<string, Command>();
    public systems = new Array<System>();
}
