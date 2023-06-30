const logger = require("./logger");
const ApiError = require("../exeptions/api-error");
const { validateAccessToken } = require("../services/token-service");

exports.unknownEndpoint = (req, res) => {
  res.status(404).send({ error: "Unknown endpoint" });
};

exports.errorHandler = (err, req, res, next) => {
  logger.error(err);

  if (err instanceof ApiError) {
    return res
      .status(err.status)
      .json({ message: err.message, errors: err.errors });
  }

  next(err);
};

exports.authorization = (req, res, next) => {
  const authHeader = req.get("authorization");
  if (!authHeader) {
    return next(ApiError.UnauthorizedError());
  }
  const [_, accessToken] = authHeader.split(" ");
  if (!accessToken) {
    return next(ApiError.UnauthorizedError());
  }

  const decodedUserData = validateAccessToken(accessToken);
  if (!decodedUserData) {
    return next(ApiError.UnauthorizedError());
  }
  req.user = decodedUserData;
  next();
};
