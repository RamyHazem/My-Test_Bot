const { Client, Partials, Collection, Routes } = require("discord.js");
const { User, Message, GuildMember, ThreadMember, Channel } = Partials;
const mongoose = require("mongoose");
const { token } = require("./config.json");
const slashHandler = require("./Handlers/slashHandler");
const deployGuild = require("./Handlers/deploy-guild");

const client = new Client({
  intents: 131071,
  partials: [User, Message, GuildMember, ThreadMember, Channel],
});

const mongooseURI =
  "mongodb+srv://Ramy:Shadyramy1234@cluster1.9l00mmc.mongodb.net/TestDB?retryWrites=true&w=majority";

client.on("ready", async () => {
  await mongoose
    .connect(mongooseURI, {
      keepAlive: true,
    })
    .then(() => console.log("Connected to the Database"))
    .catch((err) => console.error(err));

  console.log(`Logged in as ${client.user.tag}`);
});

client.commands = new Collection();
slashHandler(client);
deployGuild();

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  const command = interaction.client.commands.get(interaction.commandName);

  if (!command) return;

  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(error);
    await interaction.reply({
      content: "There was an error while executing this command!",
      ephemeral: true,
    });
  }
});

client.login(token);
