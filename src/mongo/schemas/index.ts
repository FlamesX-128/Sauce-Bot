/** @typedef {import("mongoose").Schema} Schema */

import { model, Schema } from "mongoose";

/** @type {Schema} guildSchema */
const guildSchema: Schema = new Schema({
  _id: {
    type: String,
    required: true
  },
  prefix: {
    type: String,
    required: true
  }
});

export default model('guild', guildSchema);