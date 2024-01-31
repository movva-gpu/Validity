import { generateToken } from '../../global_methods';

export class Group {
    token: string;
    alters: Array<string>; // It will be registered as an Array of alters' token.
    color: string;
    avatar: string;
    banner: string;
    name: string;
    date: string;
    desc: string;

    constructor(
        token = generateToken(),
        alters = new Array<string>(),
        color = '',
        avatar = '',
        banner = '',
        name = '',
        desc = ''
    ) {
        this.token = token;
        this.alters = alters;
        this.color = color;
        this.avatar = avatar;
        this.banner = banner;
        this.name = name;
        this.date = Date.now().toString as unknown as string;
        this.desc = desc;
    }
}
