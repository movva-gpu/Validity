import { generateUID } from '../../global_methods';
import { Group } from './Group';
import { Alter } from './Alter';

export class System {
    uid: string;
    userIDs: Array<string>;
    color: string;
    avatar: string;
    banner: string;
    name: string;
    createdAt: string;
    desc: string;
    alters: Array<Alter>;
    groups: Array<Group>;

    constructor(
        uid = generateUID(),
        userIDs = new Array<string>(),
        color = '',
        avatar = '',
        banner = '',
        name = '',
        desc = ''
    ) {
        this.uid = uid;
        this.userIDs = userIDs;
        this.color = color;
        this.avatar = avatar;
        this.banner = banner;
        this.name = name;
        this.desc = desc;
        let currentDate = new Date();
        let dateTime =
            `${currentDate.getUTCHours()}:${currentDate.getUTCMinutes()}:${currentDate.getUTCSeconds()}` +
            ` the ${currentDate.getUTCDate()}/${currentDate.getUTCMonth()}/${currentDate.getUTCFullYear()}`;
        this.createdAt = dateTime;
        this.alters = [];
        this.groups = [];
    }

    toJson(): any {
        return {
            uid: this.uid,
            userIDs: this.userIDs,
            name: this.name,
            desc: this.desc,
            color: this.color,
            avatar: this.avatar,
            banner: this.banner,
            alters: this.alters,
            groups: this.groups,
            createdAt: this.createdAt,
        };
    }
}
