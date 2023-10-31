import { generateUUID } from '../..';
import { Group } from './Group';
import { Alter } from './Alter';

export class System {
    uuid: string;
    userIDs: Array<string>;
    alters: Map<string, Alter>;
    groups: Map<string, Group>;
    color: string;
    avatar: string;
    banner: string;
    name: string;
    date: string;
    desc: string;

    constructor(uuid = generateUUID(), userIDs = new Array<string>(), alters = new Map<string, Alter>(),
        groups = new Map<string, Group>(), color = '', avatar = '', banner = '', name = '', desc = '') {
        this.uuid = uuid;
        this.userIDs = userIDs;
        this.alters = alters;
        this.groups = groups;
        this.color = color;
        this.avatar = avatar;
        this.banner = banner;
        this.name = name;
        this.date = (Date.now().toString as unknown as string);
        this.desc = desc;
    }
}
