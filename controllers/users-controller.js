require("express-async-errors");
const {
  registration,
  activate,
  login,
  logout,
  refresh,
  getAllUsers,
  changeUserPass,
  initialResetPassword,
  createNewPassword,
} = require("../services/users-service");
const { CLIENT_URL } = require("../utils/config");
const { validationResult } = require("express-validator");
const ApiError = require("../exeptions/api-error");

const COOKIE_MAX_AGE = 30 * 24 * 60 * 60 * 1000;
const COOKIE_CONFIG = {
  maxAge: COOKIE_MAX_AGE,
  httpOnly: true,
  sameSite: "none",
  secure: true,
};

exports.registration = async (req, res, next) => {
  const validationErrors = validationResult(req);
  if (!validationErrors.isEmpty()) {
    return next(
      ApiError.BadRequest("validation error", validationErrors.array())
    );
  }
  const registrationData = req.body;
  const { accessToken, refreshToken, userDto } = await registration(
    registrationData
  );
  res.cookie("refreshToken", refreshToken, COOKIE_CONFIG);
  res.status(201).json({ accessToken, userDto });
};

exports.login = async (req, res, next) => {
  const validationErrors = validationResult(req);
  if (!validationErrors.isEmpty()) {
    return next(
      ApiError.BadRequest("validation error", validationErrors.array())
    );
  }
  const { email, password } = req.body;
  const { accessToken, refreshToken, userDto } = await login(email, password);
  res.cookie("refreshToken", refreshToken, COOKIE_CONFIG);
  res.status(201).json({ accessToken, userDto });
};

exports.logout = async (req, res) => {
  const { refreshToken } = req.cookies;
  await logout(refreshToken);
  res.clearCookie("refreshToken").status(204).end();
};

exports.refresh = async (req, res) => {
  const { refreshToken } = req.cookies;
  const { accessToken, updRefreshToken, userDto } = await refresh(refreshToken);
  res.cookie("refreshToken", updRefreshToken, COOKIE_CONFIG);
  res.status(201).json({ accessToken, userDto });
};

exports.getUsers = async (req, res) => {
  const users = await getAllUsers();
  res.json(users);
};

exports.activation = async (req, res) => {
  const activationLink = req.params.link;
  await activate(activationLink);
  res.redirect(CLIENT_URL);
};

exports.editPassword = async (req, res, next) => {
  const validationErrors = validationResult(req);
  if (!validationErrors.isEmpty()) {
    return next(
      ApiError.BadRequest("validation error", validationErrors.array())
    );
  }
  const { password, newPassword } = req.body;
  const user = req.user;
  await changeUserPass(user, password, newPassword);
  res.status(200).json({ message: "password has been successfully changed" });
};

exports.resetPassword = async (req, res, next) => {
  const validationErrors = validationResult(req);
  if (!validationErrors.isEmpty()) {
    return next(
      ApiError.BadRequest("validation error", validationErrors.array())
    );
  }
  const { email } = req.body;
  await initialResetPassword(email);
  res
    .status(200)
    .json({ message: "check your email for further instructions" });
};

exports.createPassword = async (req, res, next) => {
  const validationErrors = validationResult(req);
  if (!validationErrors.isEmpty()) {
    return next(
      ApiError.BadRequest("validation error", validationErrors.array())
    );
  }
  const { newPassword, resetCode } = req.body;
  await createNewPassword(newPassword, resetCode);
  res.status(200).json({ message: "password successful changed" });
};
