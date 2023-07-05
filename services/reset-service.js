const Reset = require("../models/reset-model");

exports.saveResetConfig = async (userId, tempData, resetCode) => {
  const resetData = await Reset.findOne({ user: userId });
  if (!resetData) {
    return Reset.create({ user: userId, tempData, resetCode });
  }
  resetData.tempData = tempData;
  resetData.resetCode = resetCode;
  return resetData.save();
};

exports.findResetConfig = async (resetCode) => Reset.findOne({ resetCode });

exports.deleteResetConfig = async (resetCode) => Reset.deleteOne({ resetCode });
