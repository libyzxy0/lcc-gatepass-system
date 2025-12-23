class BadRequestError extends Error {
  status: number;
  constructor(message) {
    super(message);
    this.status = 400;
  }
}

class UnauthorizedError extends Error {
  status: number;
  constructor(message) {
    super(message);
    this.status = 401;
  }
}

class NotFoundError extends Error {
  status: number;
  constructor(message) {
    super(message);
    this.status = 404;
  }
}

export { BadRequestError, UnauthorizedError, NotFoundError }