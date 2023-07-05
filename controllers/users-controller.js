require("express-async-errors");
const {
  registration,
  activate,
  login,
  logout,
  refresh,
  getAllUsers,
  initialPasswordReset,
  confirmResetPassword,
} = require("../services/users-service");
const { CLIENT_URL } = require("../utils/config");
const { validationResult } = require("express-validator");
const ApiError = require("../exeptions/api-error");

const COOKIE_MAX_AGE = 30 * 24 * 60 * 60 * 1000;

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
  res.cookie("refreshToken", refreshToken, {
    maxAge: COOKIE_MAX_AGE,
    httpOnly: true,
  });
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
  res.cookie("refreshToken", refreshToken, {
    maxAge: COOKIE_MAX_AGE,
    httpOnly: true,
  });
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
  const maxAge = COOKIE_MAX_AGE;
  res.cookie("refreshToken", updRefreshToken, {
    maxAge,
    httpOnly: true,
  });
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

exports.initialReset = async (req, res, next) => {
  const validationErrors = validationResult(req);
  if (!validationErrors.isEmpty()) {
    return next(
      ApiError.BadRequest("validation error", validationErrors.array())
    );
  }
  const { newPassword } = req.body;
  const user = req.user;
  console.log(user);
  await initialPasswordReset(user, newPassword);
  res.status(200).json({ message: "check your email to confirm" });
};

exports.confirmReset = async (req, res) => {
  const resetCode = req.params.resetCode;
  await confirmResetPassword(resetCode);
  res.redirect(CLIENT_URL);
};
