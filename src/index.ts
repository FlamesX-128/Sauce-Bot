/** @typedef {import("discord.js").Client} Client */
/** @typedef {import("mongoose").Mongoose} Mongoose */

/** @typedef {import("fs").Stats} Stats */

/** @typedef {import("../typings").IGuildShema} IGuildShema */

import { config } from "dotenv";
config();

import { Client } from "discord.js";
/** @type {Client} client */
const client: Client = new Client();

import { Mongoose } from "mongoose";

import { lstatSync, readdirSync, Stats } from "fs";
import { join } from "path";

import mongo from "./mongo";
import guildSchema from "./mongo/schemas";
import botCache from "./cache";
import { IGuildShema } from "./interfaces";


/**
 * Read and run files from a specific directory.
 * @param {string} folder - Folder name to read and execute.
 * @returns {Promise<void>}
 */
async function readDirectory(folder: string): Promise<void> {
  /** @type {string[]} files */
  const files: string[] = readdirSync(join(__dirname, folder));

  await Promise.all([...files].map(
    /**
     * 
     * @param {string} file 
     * @returns {Promise<void>}
     */
    async (file: string): Promise<void> => {
      /** @type {Stats} stat */
      const stat: Stats = lstatSync(join(__dirname, folder, file));

      if (stat.isDirectory()) return await readDirectory(join(__dirname, folder));

      await import(join(__dirname, folder, file));
      console.log("File loaded: " + join(__dirname, folder, file));
    }));
};

client.login(process.env.TOKEN)

  .then(async () => {
    await mongo().then(
      /** 
       * @type {Mongoose} mongoose
       * @returns {Promsie<void>}
       */
      async (mongoose: Mongoose): Promise<void> => {
        try {
          /** @type {IGuildShema[]} guilds */
          const guilds: IGuildShema[] = await guildSchema.find({});

          for (const guild of guilds)
            botCache.guildPrefixes.set(guild._id, guild.prefix);

        } catch (err) {
          console.log(err);

        };

        mongoose.disconnect();
      });
  })

  .then(async () => {
    await Promise.all(
      [
        "events/",
        "commands/"
      ].map(
        /** 
         * @type {string} file
         * @returns {Promise<void>}
         */
        async (file: string): Promise<void> => await readDirectory(file))
    ).catch((err) => console.log(err));
  });

export default client;