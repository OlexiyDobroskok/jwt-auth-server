const Reset = require("../models/reset-model");

exports.saveResetConfig = async (userId, resetCode) => {
  const resetData = await Reset.findOne({ userId });
  if (!resetData) {
    return Reset.create({ userId, resetCode });
  }
  resetData.resetCode = resetCode;
  return resetData.save();
};

exports.findResetConfig = async (resetCode) => Reset.findOne({ resetCode });

exports.deleteResetConfig = async (resetCode) => Reset.deleteOne({ resetCode });
