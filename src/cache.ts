/** @typedef {import("../typings").IBotCache} IBotCache */

import { Collection } from "discord.js";

import { IBotCache, ICommandStructure } from "./interfaces";

/** @type {IBotCache} botCache */
const botCache: IBotCache = {
  commands: new Collection<string, ICommandStructure>(),
  cooldowns: new Collection<string, number>(),
  guildPrefixes: new Collection<string, string>(),
  defaultPrefix: "n!"
};

export default botCache;