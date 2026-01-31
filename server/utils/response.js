/**
 * Standard API response utility
 */
export class ApiResponse {
  /**
   * Success response
   * @param {Object} res - Express response object
   * @param {any} data - Response data
   * @param {string} message - Success message
   * @param {number} statusCode - HTTP status code
   * @param {Object} pagination - Pagination info
   */
  static success(
    res,
    data = null,
    message = "Success",
    statusCode = 200,
    pagination = null,
  ) {
    const response = {
      success: true,
      message,
      ...(data !== null && { data }),
      ...(pagination && { pagination }),
    };

    return res.status(statusCode).json(response);
  }

  /**
   * Error response
   * @param {Object} res - Express response object
   * @param {string} error - Error message
   * @param {number} statusCode - HTTP status code
   * @param {Object} details - Additional error details
   */
  static error(
    res,
    error = "Internal server error",
    statusCode = 500,
    details = null,
  ) {
    const response = {
      success: false,
      error,
      ...(details && { details }),
    };

    return res.status(statusCode).json(response);
  }

  /**
   * Created response
   * @param {Object} res - Express response object
   * @param {any} data - Created resource data
   * @param {string} message - Success message
   */
  static created(res, data = null, message = "Resource created successfully") {
    return this.success(res, data, message, 201);
  }

  /**
   * No content response
   * @param {Object} res - Express response object
   * @param {string} message - Success message
   */
  static noContent(res, message = "No content") {
    return this.success(res, null, message, 204);
  }

  /**
   * Not found response
   * @param {Object} res - Express response object
   * @param {string} message - Not found message
   */
  static notFound(res, message = "Resource not found") {
    return this.error(res, message, 404);
  }

  /**
   * Bad request response
   * @param {Object} res - Express response object
   * @param {string} message - Bad request message
   * @param {Object} details - Validation details
   */
  static badRequest(res, message = "Bad request", details = null) {
    return this.error(res, message, 400, details);
  }

  /**
   * Unauthorized response
   * @param {Object} res - Express response object
   * @param {string} message - Unauthorized message
   */
  static unauthorized(res, message = "Unauthorized") {
    return this.error(res, message, 401);
  }

  /**
   * Forbidden response
   * @param {Object} res - Express response object
   * @param {string} message - Forbidden message
   */
  static forbidden(res, message = "Forbidden") {
    return this.error(res, message, 403);
  }

  /**
   * Conflict response
   * @param {Object} res - Express response object
   * @param {string} message - Conflict message
   */
  static conflict(res, message = "Conflict") {
    return this.error(res, message, 409);
  }
}
