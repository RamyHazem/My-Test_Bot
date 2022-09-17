const { SlashCommandBuilder } = require("discord.js");
const deployGlobal = require("../../Handlers/deploy-global");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("deploy")
    .setDescription("depoly all commands to all guilds"),

  async execute(interaction) {
    await interaction.reply(`Successfully added commands to all guilds`);
    interaction.guild.commands.set([]);
    deployGlobal();
  },
};
