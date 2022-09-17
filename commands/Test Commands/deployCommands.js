const { SlashCommandBuilder } = require("discord.js");
const depolySlash = require("../../Handlers/depolySlash");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("deploy")
    .setDescription("Replies with Ping"),

  async execute(interaction) {
    await interaction.reply(`Successfully added commands to all guilds`);
    depolySlash();
  },
};
