export class NHttpError extends Error {
  status: number;
  constructor(message: any, status: number = 500, name?: string) {
    super(message);
    this.message = message;
    this.status = status;
    this.name = name || "HttpError";
  }
}

// 4xx
export class BadRequestError extends NHttpError {
  constructor(message: any) {
    super(message, 400, "BadRequestError");
  }
}
export class UnauthorizedError extends NHttpError {
  constructor(message: any) {
    super(message, 401, "UnauthorizedError");
  }
}
export class PaymentRequiredError extends NHttpError {
  constructor(message: any) {
    super(message, 402, "PaymentRequiredError");
  }
}
export class ForbiddeNHttpError extends NHttpError {
  constructor(message: any) {
    super(message, 403, "ForbiddeNHttpError");
  }
}
export class NotFoundError extends NHttpError {
  constructor(message: any) {
    super(message, 404, "NotFoundError");
  }
}
export class MethodNotAllowedError extends NHttpError {
  constructor(message: any) {
    super(message, 405, "MethodNotAllowedError");
  }
}
export class NotAcceptableError extends NHttpError {
  constructor(message: any) {
    super(message, 406, "NotAcceptableError");
  }
}
export class ProxyAuthRequiredError extends NHttpError {
  constructor(message: any) {
    super(message, 407, "ProxyAuthRequiredError");
  }
}
export class RequestTimeoutError extends NHttpError {
  constructor(message: any) {
    super(message, 408, "RequestTimeoutError");
  }
}
export class ConflictError extends NHttpError {
  constructor(message: any) {
    super(message, 409, "ConflictError");
  }
}
export class GoneError extends NHttpError {
  constructor(message: any) {
    super(message, 410, "GoneError");
  }
}
export class LengthRequiredError extends NHttpError {
  constructor(message: any) {
    super(message, 411, "LengthRequiredError");
  }
}
export class PreconditionFailedError extends NHttpError {
  constructor(message: any) {
    super(message, 412, "PreconditionFailedError");
  }
}
export class RequestEntityTooLargeError extends NHttpError {
  constructor(message: any) {
    super(message, 413, "RequestEntityTooLargeError");
  }
}
export class RequestURITooLongError extends NHttpError {
  constructor(message: any) {
    super(message, 414, "RequestURITooLongError");
  }
}
export class UnsupportedMediaTypeError extends NHttpError {
  constructor(message: any) {
    super(message, 415, "UnsupportedMediaTypeError");
  }
}
export class RequestedRangeNotSatisfiableError extends NHttpError {
  constructor(message: any) {
    super(message, 416, "RequestedRangeNotSatisfiableError");
  }
}
export class ExpectationFailedError extends NHttpError {
  constructor(message: any) {
    super(message, 417, "ExpectationFailedError");
  }
}
export class TeapotError extends NHttpError {
  constructor(message: any) {
    super(message, 418, "TeapotError");
  }
}
export class MisdirectedRequestError extends NHttpError {
  constructor(message: any) {
    super(message, 421, "MisdirectedRequestError");
  }
}
export class UnprocessableEntityError extends NHttpError {
  constructor(message: any) {
    super(message, 422, "UnprocessableEntityError");
  }
}
export class LockedError extends NHttpError {
  constructor(message: any) {
    super(message, 423, "LockedError");
  }
}
export class FailedDependencyError extends NHttpError {
  constructor(message: any) {
    super(message, 424, "FailedDependencyError");
  }
}
export class TooEarlyError extends NHttpError {
  constructor(message: any) {
    super(message, 425, "TooEarlyError");
  }
}
export class UpgradeRequiredError extends NHttpError {
  constructor(message: any) {
    super(message, 426, "UpgradeRequiredError");
  }
}
export class PreconditionRequiredError extends NHttpError {
  constructor(message: any) {
    super(message, 428, "PreconditionRequiredError");
  }
}
export class TooManyRequestsError extends NHttpError {
  constructor(message: any) {
    super(message, 429, "TooManyRequestsError");
  }
}
export class RequestHeaderFieldsTooLargeError extends NHttpError {
  constructor(message: any) {
    super(message, 431, "RequestHeaderFieldsTooLargeError");
  }
}
export class UnavailableForLegalReasonsError extends NHttpError {
  constructor(message: any) {
    super(message, 451, "UnavailableForLegalReasonsError");
  }
}

// 5xx
export class InternalServerError extends NHttpError {
  constructor(message: any) {
    super(message, 500, "InternalServerError");
  }
}
export class NotImplementedError extends NHttpError {
  constructor(message: any) {
    super(message, 501, "NotImplementedError");
  }
}
export class BadGatewayError extends NHttpError {
  constructor(message: any) {
    super(message, 502, "BadGatewayError");
  }
}
export class ServiceUnavailableError extends NHttpError {
  constructor(message: any) {
    super(message, 503, "ServiceUnavailableError");
  }
}
export class GatewayTimeoutError extends NHttpError {
  constructor(message: any) {
    super(message, 504, "GatewayTimeoutError");
  }
}
export class HTTPVersionNotSupportedError extends NHttpError {
  constructor(message: any) {
    super(message, 505, "HTTPVersionNotSupportedError");
  }
}
export class VariantAlsoNegotiatesError extends NHttpError {
  constructor(message: any) {
    super(message, 506, "VariantAlsoNegotiatesError");
  }
}
export class InsufficientStorageError extends NHttpError {
  constructor(message: any) {
    super(message, 507, "InsufficientStorageError");
  }
}
export class LoopDetectedError extends NHttpError {
  constructor(message: any) {
    super(message, 508, "LoopDetectedError");
  }
}
export class NotExtendedError extends NHttpError {
  constructor(message: any) {
    super(message, 510, "NotExtendedError");
  }
}
export class NetworkAuthenticationRequiredError extends NHttpError {
  constructor(message: any) {
    super(message, 511, "NetworkAuthenticationRequiredError");
  }
}
export function getError(err: any, isStack: boolean = false) {
  let status = err.status || err.statusCode || err.code || 500;
  if (typeof status !== "number") status = 500;
  let stack = void 0;
  if (isStack) {
    let arr = err.stack ? err.stack.split("\n") : [""];
    arr.shift();
    stack = arr
      .filter((line: string | string[]) => line.indexOf("file://") !== -1)
      .map((line: string) => line.trim());
  }
  return {
    status,
    message: err.message || "Something went wrong",
    name: err.name || "HttpError",
    stack,
  };
}
