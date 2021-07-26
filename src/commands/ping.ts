import { createCommand } from "../helpers";

createCommand({
  name: "ping",
  botChannelPerms: ["SEND_MESSAGES"],
  cooldown: 5000,
  async execute(message, _) {
    await message.reply("Pong!");
  }
});