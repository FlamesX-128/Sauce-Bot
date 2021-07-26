import type { ClientEvents, Collection, Message, PermissionResolvable } from "discord.js";

export interface ICommandStructure {
  aliases?: string[];
  botChannelPerms?: PermissionResolvable[];
  cooldown?: number;
  description?: string;
  name: string;
  nsfw?: boolean;
  execute(message: Message, args?: string[]): (Promise<void | Message>);
};

export interface IExpectedArgs {
  type: string;
  required?: boolean;
  lowerCase?: boolean;
  missing?(message: Message): Promise<void>;
};

export interface IEvent {
  type?: "on" | "once";
  name: keyof ClientEvents;
  execute(...context: any): void | Promise<void>;
};

export interface IGuildShema {
  _id: string;
  prefix: string;
  __v: any;
};

export interface IBotCache {
  commands: Collection<string, ICommandStructure>;
  cooldowns: Collection<string, number>;
  guildPrefixes: Collection<string, string>;
  defaultPrefix: string;
};