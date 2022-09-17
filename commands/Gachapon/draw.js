const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("draw")
    .setDescription("command for lucky draws"),
  async execute(interaction) {
    await interaction.reply("draw");
  },
};
