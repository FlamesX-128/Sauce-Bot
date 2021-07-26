import { MessageEmbed } from "discord.js";
import { createCommand } from "../helpers";

const nhentai = require("nhentai-js");

createCommand({
  name: "random",
  botChannelPerms: [
    "EMBED_LINKS",
    "SEND_MESSAGES",
    "VIEW_CHANNEL"
  ],
  cooldown: 5000,
  description: "Generates a random doujin.",
  nsfw: true,
  async execute(message, _) {
    const loading = new MessageEmbed()
      .setColor("EC2854")
      .setTitle("Checking the most popular...")
      .setDescription("This may take a while, please wait.")
      .setFooter(`Requested by ${message.author.username}`)
      .setTimestamp();

    const sendMessage = await message.reply(loading);
    let DoujinID;

    do {
      DoujinID = Math.floor(Math.random() * 999999).toString()
    } while (!await nhentai.exists(DoujinID));

    const doujin = await nhentai.getDoujin(DoujinID),
      embed = new MessageEmbed()
        .setColor("EC2854")
        .setTitle(doujin.title)
        .setURL(doujin.link)
        .setImage(doujin.thumbnails[0])
        .addFields([
          { name: "Tags:", value: `\`${doujin.details.tags.join("` `")}\`` },
          { name: "Pages:", value: `**\`${doujin.details.pages}\`**`, inline: true },
          { name: "Uploaded:", value: `${doujin.details.uploaded}`, inline: true },
          { name: "Languages:", value: `- ${doujin.details.languages.join("\n- ")}`, inline: true }
        ])

    if (doujin.details.artists)
      embed.addField("Artists:", `__- ${doujin.details.artists.join("\n - ")}__`, true);
    if (doujin.details.parodies)
      embed.addField("Parodies", `${doujin.details.parodies}`, true);

    return await sendMessage.edit(embed);
  }
});