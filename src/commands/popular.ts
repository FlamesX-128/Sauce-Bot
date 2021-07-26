import axios, { AxiosResponse } from "axios";
import { MessageEmbed } from "discord.js";

import { createCommand } from "../helpers";

const nhentai = require("nhentai-js");

createCommand({
  name: "popular",
  botChannelPerms: [
    "EMBED_LINKS",
    "SEND_MESSAGES",
    "VIEW_CHANNEL"
  ],
  cooldown: 5000,
  description: "Shows day's most popular doujins.",
  nsfw: true,
  async execute(message, _) {
    const loading = new MessageEmbed()
      .setColor("EC2854")
      .setTitle("Checking the most popular...")
      .setDescription("This may take a while, please wait.")
      .setFooter(`Requested by ${message.author.username}`)
      .setTimestamp();

    const sendMessage = await message.reply(loading),
      homepage = await nhentai.getHomepage();
    let thumbnail = `https://t.nhentai.net/galleries/${homepage.results[0].bookId}/thumb.`;

    for (const type of ["jpg", "png"].values()) await axios.get(thumbnail + type)
      .then((_: AxiosResponse) => thumbnail += type)
      .catch((_: Error) => { });


    const embed = new MessageEmbed()
      .setColor("EC2854")
      .setTitle(`The most popular.`)
      .setDescription(`${homepage.results[0].title}`)
      .setURL(`https://www.nhentai.net/g/${homepage.results[0].bookId}`)
      .setThumbnail(thumbnail)
      .setFooter(`Requested by ${message.author.username}`)
      .setTimestamp();

    await sendMessage.edit(embed);
  }
});