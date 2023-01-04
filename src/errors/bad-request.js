class BadRequestError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 400;
    this.message = message || "Bad Request";
  }
}

module.exports = BadRequestError;
