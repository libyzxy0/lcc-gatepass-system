class CustomAPIError extends Error {
  statusCode: number;
  constructor(message, statusCode) {
    super(message)
    this.statusCode = statusCode;
    Object.setPrototypeOf(this, CustomAPIError.prototype);
  }
}

const createCustomError = (msg, statusCode) => {
  return new CustomAPIError(msg, statusCode)
}

export { createCustomError, CustomAPIError }