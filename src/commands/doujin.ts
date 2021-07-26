import { MessageEmbed } from "discord.js";
import { createCommand } from "../helpers";

const nhentai = require("nhentai-js");

createCommand({
  name: "doujin",
  botChannelPerms: [
    "SEND_MESSAGES",
    "EMBED_LINKS"
  ],
  cooldown: 5000,
  description: "Show the info of a doujin",
  nsfw: true,
  async execute(message, args) {
    const loading = new MessageEmbed()
      .setColor("EC2854")
      .setTitle("Checking doujin ID...")
      .setDescription("This may take a while, please wait.")
      .setFooter(`Requested by ${message.author.username}`)
      .setTimestamp();

    const sendMessage = await message.reply(loading);

    if (!args![0])
      return await sendMessage.edit("Please input a ID.");

    else if (
      (isNaN(parseInt(args![0]))) || (args![0].length > 6)
    ) return await sendMessage.edit("Please input a valid ID.");

    else if (!await nhentai.exists(args![0]))
      return await sendMessage.edit("That Doujin does not exist.");

    const doujin = await nhentai.getDoujin(args![0]),
      embed = new MessageEmbed()
        .setColor("EC2854")
        .setTitle(doujin.title)
        .setURL(doujin.link)
        .setImage(doujin.pages[0])
        .setFooter(`Requested by ${message.author.username}`)
        .setTimestamp();

    if (doujin.details.tags)
      embed.addField("Tags:", `\`${doujin.details.tags.join("` `")}\``);

    embed.addFields([
      { name: "Pages:", value: `${doujin.details.pages}`, inline: true },
      { name: "Uploaded:", value: `${doujin.details.uploaded}`, inline: true },
      { name: "Languages:", value: `- ${doujin.details.languages.join("\n - ")}`, inline: true }
    ]);

    if (doujin.details.artists)
      embed.addField("Artists:", `__- ${doujin.details.artists.join("\n - ")}__`, true);

    if (doujin.details.parodies)
      embed.addField("Parodies:", `${doujin.details.parodies}`, true);

    return await sendMessage.edit(embed);
  }
});