import { createEvent } from "../helpers";

createEvent({
  name: "ready",
  type: "once",
  execute() {
    console.log("Bot ready!");
  }
})