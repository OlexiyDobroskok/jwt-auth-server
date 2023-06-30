const { Schema } = require("mongoose");
const mongoose = require("mongoose");

const tokenSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "User" },
  refreshToken: { type: String, required: true },
});

const Token = mongoose.model("Token", tokenSchema);

module.exports = Token;
