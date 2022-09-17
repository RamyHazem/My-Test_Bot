const { REST } = require("@discordjs/rest");
const { Routes } = require("discord.js");
const { clientID, guildID, token } = require("../config.json");
const fs = require("node:fs");

const rest = new REST({ version: "10" }).setToken(token);

module.exports = () => {
  const commands = [];
  const commandFolders = fs.readdirSync("./commands/");
  for (folder of commandFolders) {
    const commandFiles = fs
      .readdirSync(`./commands/${folder}`)
      .filter((file) => file.endsWith(".js"));

    for (file of commandFiles) {
      const command = require(`../commands/${folder}/${file}`);
      if (command.data) {
        commands.push(command.data.toJSON());
      }
    }
  }

  rest
    .put(Routes.applicationCommands(clientID, guildID), { body: commands })
    .then((data) => {
      console.log(
        `Successfully registered ${data.length} application commands.`
      );
    })
    .catch(console.error);
};
