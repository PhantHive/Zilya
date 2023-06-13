"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const selectChannelId = async (interaction, channels) => {
    const actionRow = new discord_js_1.ActionRowBuilder()
        .addComponents(new discord_js_1.StringSelectMenuBuilder()
        .setCustomId("channel_id")
        .setPlaceholder("Select channel to send.")
        .addOptions(...channels, {
        label: "None of the above",
        description: "I will select the channel manually.",
        value: "manually"
    }));
    let setupMsg = "Hello, Let's setup your welcome message on this server!" +
        "\nAs I can only show you the 25 first channel, you may want to select the \"None of the above\" option if you want to select the channel manually.";
    await interaction.reply({ content: setupMsg, components: [actionRow] })
        .catch(async () => {
        await interaction.editReply({ content: setupMsg, components: [actionRow] });
    });
};
const selectWelcomeTheme = async (interaction) => {
    let actionRow = new discord_js_1.ActionRowBuilder();
    actionRow.addComponents(new discord_js_1.StringSelectMenuBuilder()
        .setCustomId("theme")
        .setPlaceholder("Choose a theme")
        .addOptions({
        label: "Planes",
        emoji: "1008063352569872465",
        value: "0",
    }, {
        label: "Waifu",
        emoji: "1008062691765653554",
        value: "1",
    }, {
        label: "Landscapes",
        emoji: "1008063338355359834",
        value: "2",
    }, {
        label: "System",
        emoji: "864986373714214972",
        value: "3"
    }, {
        label: "Phearion",
        emoji: "879146014232170506",
        value: "4"
    }, {
        label: "Apocalypse",
        emoji: "830887343081783340",
        value: "5"
    }));
    //await interaction.editReply({ content: "You may want to customize your welcome message :)." });
    await interaction.reply({ content: "You may want to customize your welcome message :).", components: [actionRow] })
        .catch(async () => {
        await interaction.editReply({ content: "You may want to customize your welcome message :).", components: [actionRow] });
    });
};
const selectWelcomeColor = async (interaction) => {
    let colorRow = new discord_js_1.ActionRowBuilder()
        .addComponents(new discord_js_1.StringSelectMenuBuilder()
        .setCustomId("color")
        .setPlaceholder("Choose a color")
        .addOptions({
        label: "Blue",
        emoji: "💙",
        value: "blue",
    }, {
        label: "Red",
        emoji: "♥️",
        value: "red",
    }, {
        label: "Green",
        emoji: "💚",
        value: "green",
    }, {
        label: "Yellow",
        emoji: "💛",
        value: "yellow"
    }, {
        label: "Purple",
        emoji: "💜",
        value: "purple"
    }, {
        label: "Black",
        emoji: "🖤",
        value: "black"
    }));
    //await interaction.editReply({ content: "Choose your color." });
    await interaction.reply({ content: "Choose your color.", components: [colorRow] })
        .catch(async () => {
        await interaction.editReply({ content: "Choose your color.", components: [colorRow] });
    });
};
module.exports = {
    selectChannelId,
    selectWelcomeTheme,
    selectWelcomeColor
};