import { MessageEmbed } from "discord.js";
import NanaAPi from "nana-api";
const nhentai = new NanaAPi;

import { createCommand } from "../helpers";

createCommand({
  name: "search",
  botChannelPerms: [
    "EMBED_LINKS",
    "SEND_MESSAGES",
    "VIEW_CHANNEL"
  ],
  cooldown: 5000,
  description: "earches shit, what else do you think?",
  async execute(message, args) {
    const loading = new MessageEmbed()
      .setColor("EC2854")
      .setTitle("Checking the most popular...")
      .setDescription("This may take a while, please wait.")
      .setFooter(`Requested by ${message.author.username}`)
      .setTimestamp();

    const sendMessage = await message.reply(loading),
      validValues = ["artist", "character", "parodies", "tag"];

    if (
      (!args![0]) || (!validValues.includes(args![0].toLowerCase())) || (!args![1])
    ) return await sendMessage.edit(`Please state what you are looking for.\n Valid values: \`${validValues.join("\`, \`")}\``);

    //@ts-ignore
    const result = await nhentai[args![0]](args![1]);

    if (!result)
      return await sendMessage.edit("No results found.");

    const embed = new MessageEmbed()
      .addFields(
        { name: `\`#\`${result.results[0].id}`, value: `[${result.results[0].title}](https://www.nhentai.net/g/${result.results[0].id})` },
        { name: `\`#\`${result.results[1].id}`, value: `[${result.results[1].title}](https://www.nhentai.net/g/${result.results[1].id})` },
        { name: `\`#\`${result.results[2].id}`, value: `[${result.results[2].title}](https://www.nhentai.net/g/${result.results[2].id})` },
        { name: `\`#\`${result.results[3].id}`, value: `[${result.results[3].title}](https://www.nhentai.net/g/${result.results[3].id})` },
        { name: `\`#\`${result.results[4].id}`, value: `[${result.results[4].title}](https://www.nhentai.net/g/${result.results[4].id})` }
      )
      .setFooter(`Showing 5 results out of ${result.num_results}`)
      .setAuthor(`Searching for character ${args![1].toLowerCase()}:`, "https://cdn.discordapp.com/attachments/657043167279054898/764912603679293480/nhentai_1.png");
    
    return await sendMessage.edit(embed);
  }
});