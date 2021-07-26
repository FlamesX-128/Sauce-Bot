import { Guild } from "discord.js";
import { Mongoose } from "mongoose";
import botCache from "../cache";

import { createEvent } from "../helpers";
import mongo from "../mongo";
import guildSchema from "../mongo/schemas";

createEvent({
  name: "guildDelete",
  type: "on",
  async execute(guild: Guild) {
    await mongo().then(async (mongoose: Mongoose) => {
      try {
        await guildSchema.findByIdAndDelete(guild.id);
        botCache.guildPrefixes.delete(guild.id);
        
        //@ts-ignore
      } catch (err: Error) {
        console.log(err);

      };

      mongoose.disconnect();
    });
  }
});