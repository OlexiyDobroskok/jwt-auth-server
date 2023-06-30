require("express-async-errors");
const {
  registration,
  activate,
  login,
  logout,
  refresh,
  getAllUsers,
} = require("../services/users-service");
const { CLIENT_URL } = require("../utils/config");
const { validationResult } = require("express-validator");
const ApiError = require("../exeptions/api-error");

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
  const maxAge = 30 * 24 * 60 * 60;
  res.cookie("refreshToken", refreshToken, {
    maxAge,
    httpOnly: true,
  });
  return res.status(201).json({ accessToken, userDto });
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  const { accessToken, refreshToken, userDto } = await login(email, password);
  const maxAge = 30 * 24 * 60 * 60;
  res.cookie("refreshToken", refreshToken, { maxAge, httpOnly: true });
  return res.status(201).json({ accessToken, userDto });
};

exports.logout = async (req, res) => {
  const { refreshToken } = req.cookies;
  await logout(refreshToken);
  res.clearCookie("refreshToken").status(204).end();
};

exports.refresh = async (req, res) => {
  const { refreshToken } = req.cookies;
  const { accessToken, updRefreshToken, userDto } = await refresh(refreshToken);
  const maxAge = 30 * 24 * 60 * 60;
  res.cookie("refreshToken", updRefreshToken, { maxAge, httpOnly: true });
  return res.status(201).json({ accessToken, userDto });
};

exports.getUsers = async (req, res) => {
  const users = await getAllUsers();
  return res.json(users);
};

exports.activation = async (req, res) => {
  const activationLink = req.params.link;
  await activate(activationLink);
  return res.redirect(CLIENT_URL);
};
