const jwt = require("jsonwebtoken");
const { JWT_REFRESH_SECRET, JWT_ACCESS_SECRET } = require("../utils/config");
const Token = require("../models/token-model");

exports.generateTokens = (payload) => {
  const accessToken = jwt.sign(payload, JWT_ACCESS_SECRET, {
    expiresIn: "30m",
  });
  const refreshToken = jwt.sign(payload, JWT_REFRESH_SECRET, {
    expiresIn: "30d",
  });

  return { accessToken, refreshToken };
};

exports.saveToken = async (userId, refreshToken) => {
  const tokenData = await Token.findById(userId);
  if (tokenData) {
    tokenData.refreshToken = refreshToken;
    return tokenData.save();
  }
  return await Token.create({ user: userId, refreshToken });
};

exports.removeToken = async (refreshToken) => {
  await Token.deleteOne({ refreshToken });
};

exports.findRefreshToken = async (refreshToken) =>
  await Token.findOne({ refreshToken });

exports.validateAccessToken = (token) => {
  try {
    return jwt.verify(token, JWT_ACCESS_SECRET);
  } catch (error) {
    return null;
  }
};
exports.validateRefreshToken = (token) => {
  try {
    return jwt.verify(token, JWT_REFRESH_SECRET);
  } catch (error) {
    return null;
  }
};
