import { Client, Collection } from 'discord.js'

import { System } from './system_handling/System'
import { Command } from './Command'

export class ValidityClient extends Client {
    private _commands = new Collection<string, Command>();
    private _systems = new Array<System>();

    public get commands() {
        return this._commands;
    }
    public set commands(value) {
        this._commands = value;
    }

    public get systems() {
        return this._systems;
    }
    public set systems(value) {
        this._systems = value;
    }
}