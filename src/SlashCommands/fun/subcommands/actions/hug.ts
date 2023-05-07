import {SlashCommand} from "../../../../structures/SlashCommand";
import {EmbedBuilder} from "discord.js";
import {ExtendedInteraction} from "../../../../typings/SlashCommand";


exports.default = new SlashCommand({
    name: 'hug',
    description: 'Hug someone',
    options: [
        {
            "name": "user",
            "description": "User to hug",
            "type": 6,
            "required": true
        }
    ],
    run: async ({interaction}) => {
        const user = (interaction as ExtendedInteraction).options.getUser('user');
        let huggedOne;

        if (user.id === interaction.user.id) {
            huggedOne = "him/herself";
        }
        else if (user.bot) {
            huggedOne = "a beautiful BOT";
        }
        else {
            huggedOne = user;
        }

        // use tenor api to get a random gif of anime hug
        let search_term = "anime hug";
        let search_hug: string = "https://g.tenor.com/v1/search?q=" + search_term + "&key=" +
            process.env.TENOR_API + "&limit=" + 20;

        let response = await fetch(search_hug);
        let json = await response.json();
        let index = Math.floor(Math.random() * json.results.length);
        let hug: string = json.results[index].media[0].gif.url;

        // send the embed
        const embed = new EmbedBuilder()
            .setColor('#00ff9d')
            .setTitle(`♥ ${interaction.user.username} hugged ${huggedOne} ♥`)
            .setImage(hug)
            .setTimestamp()

        await interaction.reply({embeds: [embed]});

    }
});
