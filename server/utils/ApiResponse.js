class ApiResponse {
  constructor(statusCode, message, data = null) {
    this.success = statusCode < 400;
    this.message = message;
    if (data !== null) this.data = data;
  }

  static ok(res, message, data) {
    return res.status(200).json(new ApiResponse(200, message, data));
  }

  static created(res, message, data) {
    return res.status(201).json(new ApiResponse(201, message, data));
  }

  static error(res, statusCode, message, errors) {
    return res.status(statusCode).json({
      success: false,
      message,
      ...(errors && { errors }),
    });
  }
}

module.exports = ApiResponse;
