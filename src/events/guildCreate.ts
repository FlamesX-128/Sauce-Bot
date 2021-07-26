import { Guild } from "discord.js";
import { Mongoose } from "mongoose";
import botCache from "../cache";

import { createEvent } from "../helpers";
import mongo from "../mongo";
import guildSchema from "../mongo/schemas";

createEvent({
  name: "guildCreate",
  type: "on",
  async execute(guild: Guild) {
    await mongo().then(async (mongoose: Mongoose) => {
      try {
        await new guildSchema({ _id: guild.id, prefix: botCache.defaultPrefix }).save();
        botCache.guildPrefixes.set(guild.id, botCache.defaultPrefix);

      //@ts-ignore
      } catch (err: Error) {
        console.log(err) ;
      
      };

      mongoose.disconnect();
    });
  }
});