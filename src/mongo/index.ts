/** @typedef {import("mongoose").mongoose} mongoose */

import mongoose from "mongoose";

/**
 * @returns {Promise<typeof mongoose>}
 */
async function mongo(): Promise<typeof mongoose> {
  await mongoose.connect(process.env.mongoPath!, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
  });

  return mongoose;
};

export default mongo;