import { Message } from "discord.js";

import botCache from "../cache";
import { createEvent } from "../helpers";
import { validateCommand } from "../helpers/validateCommand";
import { ICommandStructure } from "../interfaces";

createEvent({
  name: "message",
  type: "on",
  async execute(message: Message) {
    const prefix = message.channel.type !== "dm" ? botCache.guildPrefixes.get(message.guild!.id)
    : botCache.defaultPrefix

    if (
      (!prefix) || 
      (!message.content.startsWith(prefix)) || (message.author.bot)
    ) return;

    const args = message.content.split(" "),
      commandTarget = args[0].replace(prefix, "");
    args.shift();

    Promise.all([...botCache.commands].map((command: [string, ICommandStructure]) => {
      if (
        (command[0] === commandTarget) ||
        (command[1].aliases?.includes(commandTarget))
      ) return validateCommand(args, command[1], message);
    }));
  }
});