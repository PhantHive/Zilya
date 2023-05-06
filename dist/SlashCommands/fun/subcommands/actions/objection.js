"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const SlashCommand_1 = require("../../../../structures/SlashCommand");
const discord_js_1 = require("discord.js");
exports.default = new SlashCommand_1.SlashCommand({
    name: 'hug',
    description: 'Hug someone',
    run: async ({ interaction }) => {
        // use tenor api to get a random gif of anime hug
        let search_term = "objection";
        let search_hug = "https://g.tenor.com/v1/search?q=" + search_term + "&key=" +
            process.env.TENOR_API + "&limit=" + 20;
        let response = await fetch(search_hug);
        let json = await response.json();
        let index = Math.floor(Math.random() * json.results.length);
        let objection = json.results[index].media[0].gif.url;
        // send the embed
        const embed = new discord_js_1.EmbedBuilder()
            .setColor('#00ff9d')
            .setTitle(`${interaction.user.username} Objected!`)
            .setImage(objection)
            .setTimestamp();
        await interaction.reply({ embeds: [embed] });
    }
});
