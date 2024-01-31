import {
    ChatInputCommandInteraction,
    Locale,
    SlashCommandSubcommandBuilder,
} from 'discord.js';

import { System } from '../../../classes/system_handling/System';

import {
    generateUID,
    getLangsData,
    getUrlResponse,
    saveDatabase,
    stringOptionNormalize,
    userHasSystem,
} from '../../../global_methods';

import {
    DatabaseError,
    OptionError,
    SystemError,
    SystemsDataType,
} from '../system';

const langs = getLangsData();

export const data = new SlashCommandSubcommandBuilder()
    .setName('create')
    .setDescription(
        langs['en-US'].commands.system.subcommands?.create.description as string
    )
    .addStringOption((option) => {
        for (const locale in langs) {
            option.setDescriptionLocalization(
                locale as Locale,
                langs[locale].commands.system.subcommands?.create.options
                    ?.name as string
            );
        }
        return option
            .setName('name')
            .setRequired(true)
            .setDescription(
                langs['en-US'].commands.system.subcommands?.create.options
                    ?.name as string
            )
            .setMaxLength(64)
            .setMinLength(3);
    })
    .addStringOption((option) => {
        for (const locale in langs) {
            option.setDescriptionLocalization(
                locale as Locale,
                langs[locale].commands.system.subcommands?.create.options
                    ?.color as string
            );
        }
        return option
            .setName('color')
            .setDescription(
                langs['en-US'].commands.system.subcommands?.create.options
                    ?.color as string
            )
            .setMinLength(7)
            .setMaxLength(7); // #789000, 1 for #, 2 for red, 2 for green and 2 for blue. no support for web colors.
    })
    .addStringOption((option) => {
        for (const locale in langs) {
            option.setDescriptionLocalization(
                locale as Locale,
                langs[locale].commands.system.subcommands?.create.options
                    ?.description as string
            );
        }
        return option
            .setName('description')
            .setDescription(
                langs['en-US'].commands.system.subcommands?.create.options
                    ?.description as string
            )
            .setMaxLength(1024);
    })
    .addStringOption((option) => {
        for (const locale in langs) {
            option.setDescriptionLocalization(
                locale as Locale,
                langs[locale].commands.system.subcommands?.create.options
                    ?.avatar as string
            );
        }
        return option
            .setName('avatar')
            .setDescription(
                langs['en-US'].commands.system.subcommands?.create.options
                    ?.avatar as string
            );
    });

for (const locale in langs) {
    data.setDescriptionLocalization(
        locale as Locale,
        langs[locale].commands.system.subcommands?.create.description as string
    );
}

export async function execute(
    interaction: ChatInputCommandInteraction
): Promise<number | void> {
    const colorRegex = /^#[0-9A-Fa-f]{6}$/i;

    const systemsData: SystemsDataType = require('../../../../data/data.json');
    let avatarUrl: string | undefined;

    if (userHasSystem(interaction.user, systemsData))
        return SystemError.AlreadyExists;

    const nameOption = stringOptionNormalize(
        interaction,
        'name',
        true
    ) as string;
    let colorOption = stringOptionNormalize(interaction, 'color');
    const avatarUrlOption = stringOptionNormalize(interaction, 'avatar');
    const descOption = stringOptionNormalize(interaction, 'description');

    if (colorOption) {
        if (!colorRegex.test(colorOption)) return OptionError.NotHexColor;
    }

    if (avatarUrlOption) {
        let error = await getUrlResponse(avatarUrlOption);

        if (error) return error as number;
        avatarUrl = avatarUrlOption;
    }

    let system = new System(
        generateUID(),
        [interaction.user.id],
        colorOption,
        avatarUrl,
        undefined,
        nameOption,
        descOption
    );
    const newSystemData = systemsData;
    newSystemData.systems.push(system.toJson());
    return saveDatabase(newSystemData, DatabaseError.SavingError);
}
