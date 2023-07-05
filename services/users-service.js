const User = require("../models/user-model");
const bcrypt = require("bcrypt");
const uuid = require("uuid");
const {
  sendActivationMail,
  sendConfirmPasswordChangesMail,
} = require("./mail-service");
const { getUserDto } = require("../dtos/user-dto");
const {
  generateTokens,
  saveToken,
  removeToken,
  validateRefreshToken,
  findRefreshToken,
} = require("./token-service");
const ApiError = require("../exeptions/api-error");
const { API_URL } = require("../utils/config");
const {
  saveResetConfig,
  findResetConfig,
  deleteResetConfig,
} = require("./reset-service");

exports.registration = async ({ email, password, userName }) => {
  const user = await User.findOne({ email });
  if (user) {
    throw ApiError.ConflictError("email address already in use");
  }
  const passwordHash = await bcrypt.hash(password, 10);
  const activationLink = uuid.v4();
  const newUser = await User.create({
    email,
    passwordHash,
    userName,
    activationLink,
  });
  const mailActivationLink = `${API_URL}/api/users/activation/${activationLink}`;
  // await sendActivationMail(email, mailActivationLink);
  const userDto = getUserDto(newUser);
  const { accessToken, refreshToken } = generateTokens(userDto);
  await saveToken(userDto.id, refreshToken);

  return { accessToken, refreshToken, userDto };
};

exports.activate = async (activationLink) => {
  const user = await User.findOne({ activationLink });
  if (!user) {
    throw ApiError.BadRequest("incorrect activation link");
  }
  user.isActivated = true;
  return user.save();
};

exports.login = async (email, password) => {
  const user = await User.findOne({ email });
  const passwordIsCorrect =
    user === null ? false : await bcrypt.compare(password, user.passwordHash);
  if (!passwordIsCorrect) {
    throw ApiError.UnauthorizedError("invalid email or password");
  }
  const userDto = getUserDto(user);
  const { accessToken, refreshToken } = generateTokens(userDto);
  await saveToken(userDto.id, refreshToken);
  return { accessToken, refreshToken, userDto };
};

exports.logout = async (refreshToken) => removeToken(refreshToken);

exports.refresh = async (refreshToken) => {
  if (!refreshToken) {
    throw ApiError.UnauthorizedError();
  }
  const decodedUserData = validateRefreshToken(refreshToken);
  const refreshTokenFromDb = await findRefreshToken(refreshToken);
  if (!decodedUserData || !refreshTokenFromDb) {
    throw ApiError.UnauthorizedError();
  }
  const user = await User.findById(decodedUserData.id);
  const userDto = getUserDto(user);
  const { accessToken, refreshToken: updRefreshToken } =
    generateTokens(userDto);
  await saveToken(userDto.id, updRefreshToken);

  return { accessToken, updRefreshToken, userDto };
};

exports.getAllUsers = async () => User.find({});

exports.initialPasswordReset = async (user, newPassword) => {
  const newPasswordHash = await bcrypt.hash(newPassword, 10);
  const resetCode = uuid.v4();
  await saveResetConfig(user.id, newPasswordHash, resetCode);
  const confirmLink = `${API_URL}/api/users/reset/${resetCode}`;
  await sendConfirmPasswordChangesMail(user.email, confirmLink);
};

exports.confirmResetPassword = async (resetCode) => {
  const { user: userId, tempData: newPasswordHash } = await findResetConfig(
    resetCode
  );
  if (!userId) {
    throw ApiError.BadRequest("incorrect reset code");
  }
  await User.findByIdAndUpdate(userId, { passwordHash: newPasswordHash });

  await deleteResetConfig(resetCode);
};
