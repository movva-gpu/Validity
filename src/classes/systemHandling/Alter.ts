import { generateToken } from '../../globalMethods'

export class Alter {
    token: string;
    color: string;
    avatar: string;
    banner: string;
    name: string;
    displayName: string;
    pronouns: string;
    date: string;
    desc: string;

    constructor(token = generateToken(), color = '', avatar = '', banner = '', name = '', displayName = '',
            pronouns = '', desc = '') {
        this.token = token;
        this.color = color;
        this.avatar = avatar;
        this.banner = banner;
        this.name = name;
        this.displayName = displayName;
        this.pronouns = pronouns;
        this.date = (Date.now().toString as unknown as string);
        this.desc = desc;
    }
}
