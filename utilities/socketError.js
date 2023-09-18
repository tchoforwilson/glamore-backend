class SocketError extends Error {
  constructor(message, code) {
    super(message);
    this.code = code;
    this.name = 'SocketError';
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}
