import { SlashCommand } from '../../structures/SlashCommand';
import { ExtendedInteraction } from '../../typings/SlashCommand';
import { NekosAPI } from 'nekosapi';
import fetch from 'node-fetch';

async function getNSFWContent(request: string): Promise<string | null> {
    // use nekobot.xyz api to get a random nsfw image
    const response = await fetch(
        `https://nekobot.xyz/api/image?type=${request}`
    );
    const json = await response.json();
    if (json.success === true) {
        return json.message;
    }
    return null;
}

const nsfw = new SlashCommand({
    name: 'neko',
    description: 'nekos',
    nsfw: true,
    options: [
        {
            name: 'sfw',
            description: 'SFW neko',
            type: 3,
            required: true,
        },
    ],
    run: async ({ interaction }) => {
        await interaction.deferReply();

        const request = (interaction as ExtendedInteraction).options.getString(
            'sfw',
        );

        const url = await getNSFWContent(request);

        if (url === null) {
            await interaction.editReply('No neko content found.');
        } else {
            await interaction.editReply({ content: url });
        }
    },
});

//export default nsfw;