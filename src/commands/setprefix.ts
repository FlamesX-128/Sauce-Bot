import { Mongoose } from "mongoose";
import botCache from "../cache";
import { createCommand } from "../helpers";

import mongo from "../mongo";
import guildSchema from "../mongo/schemas";

createCommand({
  name: "set-prefix",
  aliases: ["setprefix"],
  botChannelPerms: [
    "SEND_MESSAGES",
    "VIEW_CHANNEL"
  ],
  cooldown: 5000,
  description: "Change bot prefix.",
  async execute(message, args) {
    if (message.channel.type === "dm")
      return await message.reply("This command is only valid on servers.");
    else if (!args![0] || args![0].length < 2 || args![0].length > 5)
      return await message.reply("Please enter a valid prefix.");
    else if (!message.member?.hasPermission("ADMINISTRATOR"))
      return await message.reply("You need \"ADMINISTRATOR\" permission for this command!");

    await mongo().then(async (mongoose: Mongoose) => {
      try {
        await guildSchema.updateOne(
          { _id: message.guild!.id },
          { prefix: args![0] }
        );

        botCache.guildPrefixes.set(message.guild!.id, args![0]);
        message.reply("The new prefix is " + args![0]);
        //@ts-ignore
      } catch (err: Error) {
        console.log(err);
      };

      mongoose.disconnect();
    });
  }
});