const mongoose = require("mongoose");
const { Schema } = require("mongoose");

const resetSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User" },
    resetCode: { type: String, required: true },
  },
  { timestamps: true }
);

resetSchema.index({ createdAt: 1 }, { expireAfterSeconds: 30 });

const Reset = mongoose.model("Reset", resetSchema);

module.exports = Reset;
