const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const donoSchema = require("../../Models/donoSchema");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("dono")
    .setDescription("add donations")
    .addSubcommand((subcommand) =>
      subcommand
        .setName("check")
        .setDescription("check user donations")
        .addUserOption((option) =>
          option
            .setName("target")
            .setDescription("the user to check the balance of")
            .setRequired(false)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("add")
        .setDescription("add to user donations")
        .addNumberOption((option) =>
          option
            .setName("amount")
            .setDescription("the amount to add to donations")
            .setRequired(true)
        )
        .addUserOption((option) =>
          option
            .setName("target")
            .setDescription("user to add the amount to")
            .setRequired(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("clear")
        .setDescription("clear the user's donations")
        .addUserOption((option) =>
          option
            .setName("target")
            .setDescription("user to clear the donations of")
            .setRequired(true)
        )
    ),

  async execute(interaction) {
    // if profile doesnt exist

    const userData = await donoSchema.findOne({
      userID: interaction.user.id,
      guildID: interaction.guild.id,
    });

    if (!userData) {
      const newUser = new donoSchema({
        userID: interaction.user.id,
        guildID: interaction.guild.id,
        userTag: interaction.user.tag,
        donations: 0,
      });

      await newUser
        .save()
        // .then(() => interaction.channel.send("created new profile"))
        .catch((err) => console.log(err));
    }

    // handling dono check
    if (interaction.options.getSubcommand() === "check") {
      const user = interaction.options.getUser("target") ?? interaction.user;

      const userData = await donoSchema.findOne({
        userID: user.id,
        guildID: interaction.guild.id,
      });
      const donoCheckEmbed = new EmbedBuilder();

      if (userData) {
        donoCheckEmbed
          .setTitle(`**${user.tag || interaction.user.tag}'s donations**`)
          .setDescription(
            `╭───╯\n┃\n┃ :moneybag:  Amount donated: **${
              userData.donations
            }**\n┃\n╰┈┈➤ ${user.tag || interaction.user.tag}'s donations`
          )
          .setColor("Random");
      } else {
        interaction.reply(
          "User has not created a profile, run a command to create a profile"
        );
        return;
      }

      try {
        await interaction.reply({ embeds: [donoCheckEmbed] });
      } catch (err) {
        console.log(err);
      }
    }

    //handling dono add
    if (interaction.options.getSubcommand() === "add") {
      const amount = interaction.options.getNumber("amount");
      const user = interaction.options.getUser("target");

      const userData = await donoSchema.findOneAndUpdate(
        {
          userID: user.id,
          guildID: interaction.guild.id,
        },
        {
          $inc: {
            donations: amount,
          },
        }
      );

      const userTotalDonations = await donoSchema.findOne({
        userID: user.id,
      });

      const donoAddEmbed = new EmbedBuilder()
        .setDescription(
          `╭───╯\n┃ :moneybag:  Donated: **${amount}**\n┃New Donation Amount: **${userTotalDonations.donations}**\n┃\n╰┈┈➤ ${user.tag}'s donations`
        )
        .setColor("Random");

      try {
        if (userData) {
          await interaction.reply({ embeds: [donoAddEmbed] });
        } else {
          interaction.reply(
            "User has not created a profile, run a command to create a profile"
          );
        }
      } catch (err) {
        console.log(err);
      }
    }

    //handling dono clear
    if (interaction.options.getSubcommand() === "clear") {
      const user = interaction.options.getUser("target");
      const userData = await donoSchema.findOneAndUpdate(
        {
          userID: user.id,
          guildID: interaction.guild.id,
        },
        {
          donations: 0,
        }
      );

      if (userData) {
        interaction.reply(`removed ${user.tag}'s donations`);
      }
    }
  },
};
