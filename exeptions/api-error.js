class ApiError extends Error {
  status;
  errors;
  constructor(status, message, errors = []) {
    super(message);
    this.status = status;
    this.errors = errors;
  }

  static UnauthorizedError(message = "Unauthorized Access") {
    return new ApiError(401, message);
  }

  static BadRequest(message, errors) {
    return new ApiError(400, message, errors);
  }

  static ConflictError(message, errors) {
    return new ApiError(409, message, errors);
  }
}

module.exports = ApiError;
