/** @typedef {import("discord.js").Message} Message */
/** @typedef {import("discord.js").PermissionResolvable} PermissionResolvable */

/** @typedef {import("../../typings").ICommandStructure} ICommandStructure */

import { Message, PermissionResolvable } from "discord.js";
import botCache from "../cache";
import { ICommandStructure } from "../interfaces";

/**
 * Validate command.
 * @param {string[]} args - User arguments.
 * @param {ICommandStructure} command - Command Structure.
 * @param {Message} message - Message from discord.
 * @returns {Promise<void>}
 */
export async function validateCommand(
  args: string[],
  command: ICommandStructure,
  message: Message
): Promise<void> {
  /** @type {PermissionResolvable[]} missingPerms */
  const missingPerms: PermissionResolvable[] = [],
    /** @type {boolean | undefined} sendMessages */
    sendMessages: boolean | undefined = message.guild?.me?.permissionsIn(message.channel).has("SEND_MESSAGES"),

    /**
     * Send message to discord.
     * @param {string} msg - Message to send.
     * @returns {Promise<void>}
     */
    sendMessage = async (msg: string): Promise<void> => {
      try {
        if (sendMessages) await message.reply(msg);
        else await message.author.send(msg);
      } catch (err) { console.log(err) };
    };

  if (message.channel.type !== "dm") {
    command.botChannelPerms?.forEach(
      /**
       * @param {PermissionResolvable} permission
       */
      (permission: PermissionResolvable) => {
        if (!message.guild?.me?.permissionsIn(message.channel).has(permission)) missingPerms.push(permission);
      }
    );


    if (missingPerms.length)
      return sendMessage(`I'am missing permissions: "${missingPerms.join(", ")}"`);


    if (command.nsfw && !message.channel.nsfw)
      return sendMessage("This command is only available on nsfw channels");
  };

  if (command.cooldown) {
    const userTarget = `${message.guild?.id}_${message.member?.id}_${command.name}`;

    // Check if user has cooldown
    if (botCache.cooldowns.has(userTarget)) {
      const timeLeft = msToTime(botCache.cooldowns.get(userTarget)! - Date.now());
      return sendMessage(`Please wait ${timeLeft} to use this command again`);
    };

    botCache.cooldowns.set(userTarget, Date.now() + command.cooldown);

    setTimeout(() => botCache.cooldowns.delete(userTarget), command.cooldown);
  };

  command.execute(message, args)
    .catch((err: Error) => console.log(err));
};


/**
 * Convert millisecounds.
 * @param {number} ms - Millisecounds to convert.
 * @returns {string}
 */
function msToTime(ms: number): string {
  const seconds = (ms / 1000),
    minutes = (ms / (1000 * 60)),
    hours = (ms / (1000 * 60 * 60)),
    days = (ms / (1000 * 60 * 60 * 24));

  if (seconds < 60) return seconds + " secounds";
  else if (minutes < 60) return minutes + " minutes";
  else if (hours < 24) return hours + " hours";
  return days + " days";
};