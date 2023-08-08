"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setColor = exports.setTheme = exports.setChannelId = exports.nextStep = void 0;
const tslib_1 = require("tslib");
const discord_js_1 = require("discord.js");
const wait = require('node:timers/promises').setTimeout;
const selectCustom_1 = require("../selector/selectCustom");
const theme_json_1 = tslib_1.__importDefault(require("../../../../../../assets/data/theme.json"));
const isChannelValid = async (channel, configName) => new Promise((resolve, reject) => {
    const id = Number(channel);
    if (Number.isInteger(id) && id !== 0) {
        resolve(`Thank you! I will setup ${configName} message in this channel.`);
    }
    else {
        reject(`Sorry, I can't setup the ${configName} message in this channel. It is probably not a valid channel.`);
    }
});
const nextStep = async (data, interaction) => {
    new Promise(async (resolve, reject) => {
        let channels = interaction.guild.channels.cache.filter(c => c.type === discord_js_1.ChannelType.GuildText).map(c => {
            return {
                label: `${c.name}`,
                value: `${c.id}`
            };
        });
        if (channels.length >= 25) {
            channels.splice(24, channels.length - 23);
        }
        if (data.channelId === "0") {
            await (0, selectCustom_1.selectChannelId)(interaction, channels);
        }
        else if (data.theme === -1) {
            await (0, selectCustom_1.selectWelcomeTheme)(interaction);
        }
        else if (data.color === "#000000") {
            await (0, selectCustom_1.selectWelcomeColor)(interaction);
        }
        else {
            let msg = `All data are saved for <#${data.channelId}>\n` +
                `\`\`\`js\nChannel ID: ${data.channelId}\n` +
                `Theme: ${theme_json_1.default[data.theme].name}\n` +
                `Color: ${data.color}\`\`\`` +
                `you can reset the welcome message with the command: \`/welcome remove\` or edit it with the command: \`/welcome edit\``;
            resolve(msg);
        }
    })
        .then(async (res) => {
        // all data is present
        await interaction.reply({
            content: res
        })
            .catch(async () => {
            await interaction.editReply({
                content: res
            });
        });
    });
};
exports.nextStep = nextStep;
// the second function setChannelId(data, interaction) will first check if the option selected is "manually" or not. If it is then we will ask the user to select a channel. If it is not then we will check if the channel is valid or not. If it is not then we will create a collector to wait for the user to select a channel. If it is valid then we will proceed to the nextStep() function.
// if it's not manual we will check if the channel is valid. If not we abort the command and tell the user that the channel is not valid. If it is valid we save it into data.channel_id then we proceed to the nextStep() function
const setChannelId = async (data, interaction) => {
    return new Promise(async (resolve, reject) => {
        if (interaction.values[0] === "manually") {
            // create a message collector to wait for the user to select a channel
            const filter = (m) => m.author.id === interaction.user.id;
            const collector = interaction.channel.createMessageCollector({ filter, time: 60000, max: 1 });
            await interaction.update({ content: "Please write the ID of the desired channel for welcome messages to appear.", components: [] });
            collector.on('collect', async (m) => {
                try {
                    await isChannelValid(m.content, "welcome");
                    data.channelId = m.content;
                    data.save();
                    await wait(2000);
                    await m.delete();
                    // reply to the user that the channel is valid and that we will proceed to the next step and remove the components
                    resolve("Thank you! I will setup the welcome message in this channel. Proceeding to the next step...");
                }
                catch (e) {
                    await interaction.reply({ content: e, ephemeral: true });
                    reject(e);
                }
            });
        }
        else {
            try {
                await isChannelValid(interaction.values[0], "welcome");
                data.channelId = interaction.values[0];
                data.save();
                // reply to the user that the channel is valid and that we will proceed to the next step and remove the components
                resolve("Thank you! I will setup the welcome message in this channel. Proceeding to the next step...");
            }
            catch (e) {
                await interaction.reply({ content: e, ephemeral: true });
                reject(e);
            }
        }
    })
        .then(async (res) => {
        await interaction.update({ content: res, components: [] })
            .catch(async () => {
            await interaction.editReply({ content: res });
        });
        await wait(2000);
        await nextStep(data, interaction);
    })
        .catch(async (err) => {
        await interaction.update({ content: err, components: [] })
            .catch(async () => {
            await interaction.editReply({ content: err });
        });
        await wait(2000);
        await nextStep(data, interaction);
    });
};
exports.setChannelId = setChannelId;
// the third function setTheme(data, interaction) will get the value and set the theme accordingly before proceeding to the nextStep() function
const setTheme = async (data, interaction) => {
    // make it a promises, if the set fail then warn the user and abort the command
    let choosedTheme = parseInt(interaction.values[0]);
    let themeName = theme_json_1.default[choosedTheme].name;
    new Promise((resolve, reject) => {
        // check if the theme is between 1 and 6
        if (choosedTheme >= 0 && choosedTheme <= 5) {
            data.theme = choosedTheme;
            data.save();
            resolve(`You choosed the theme: **${themeName}**, I will setup the welcome message with this theme.\n Proceeding to the next step...`);
        }
        else {
            reject("Sorry, I can't setup the welcome message with this theme. Please try again.");
        }
    })
        .then(async (res) => {
        await interaction.update({ content: res, components: [] });
        await wait(3000);
        await nextStep(data, interaction);
    })
        .catch(async (err) => {
        await interaction.update({ content: err, components: [] });
    });
};
exports.setTheme = setTheme;
// last function is for color, it will get the value and set the color accordingly before proceeding to the nextStep() function
const setColor = async (data, interaction) => {
    // make it a promises, if the set fail then warn the user and abort the command
    let choosedColor = interaction.values[0];
    new Promise((resolve, reject) => {
        if (choosedColor !== "#000000") {
            data.color = choosedColor;
            data.save();
            resolve(`You choosed the color: **${choosedColor}**, I will setup the welcome message with this color.\n Proceeding to the next step...`);
        }
        else {
            reject("Sorry, I can't setup the welcome message with this color. Please try again.");
        }
    })
        .then(async (res) => {
        await interaction.update({ content: res, components: [] });
        await wait(3000);
        await nextStep(data, interaction);
    })
        .catch(async (err) => {
        await interaction.update({ content: err, components: [] });
    });
};
exports.setColor = setColor;
