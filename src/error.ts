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
/**
 * Status 400
 * @example
 * throw new BadRequestError("message");
 */
export class BadRequestError extends NHttpError {
  constructor(message: any) {
    super(message, 400, "BadRequestError");
  }
}
/**
 * Status 401
 * @example
 * throw new UnauthorizedError("message");
 */
export class UnauthorizedError extends NHttpError {
  constructor(message: any) {
    super(message, 401, "UnauthorizedError");
  }
}
/**
 * Status 402
 * @example
 * throw new PaymentRequiredError("message");
 */
export class PaymentRequiredError extends NHttpError {
  constructor(message: any) {
    super(message, 402, "PaymentRequiredError");
  }
}
/**
 * Status 403
 * @example
 * throw new ForbiddenError("message");
 */
export class ForbiddenError extends NHttpError {
  constructor(message: any) {
    super(message, 403, "ForbiddenError");
  }
}
/**
 * Status 404
 * @example
 * throw new NotFoundError("message");
 */
export class NotFoundError extends NHttpError {
  constructor(message: any) {
    super(message, 404, "NotFoundError");
  }
}
/**
 * Status 405
 * @example
 * throw new MethodNotAllowedError("message");
 */
export class MethodNotAllowedError extends NHttpError {
  constructor(message: any) {
    super(message, 405, "MethodNotAllowedError");
  }
}
/**
 * Status 406
 * @example
 * throw new NotAcceptableError("message");
 */
export class NotAcceptableError extends NHttpError {
  constructor(message: any) {
    super(message, 406, "NotAcceptableError");
  }
}
/**
 * Status 407
 * @example
 * throw new ProxyAuthRequiredError("message");
 */
export class ProxyAuthRequiredError extends NHttpError {
  constructor(message: any) {
    super(message, 407, "ProxyAuthRequiredError");
  }
}
/**
 * Status 408
 * @example
 * throw new RequestTimeoutError("message");
 */
export class RequestTimeoutError extends NHttpError {
  constructor(message: any) {
    super(message, 408, "RequestTimeoutError");
  }
}
/**
 * Status 409
 * @example
 * throw new ConflictError("message");
 */
export class ConflictError extends NHttpError {
  constructor(message: any) {
    super(message, 409, "ConflictError");
  }
}
/**
 * Status 410
 * @example
 * throw new GoneError("message");
 */
export class GoneError extends NHttpError {
  constructor(message: any) {
    super(message, 410, "GoneError");
  }
}
/**
 * Status 411
 * @example
 * throw new LengthRequiredError("message");
 */
export class LengthRequiredError extends NHttpError {
  constructor(message: any) {
    super(message, 411, "LengthRequiredError");
  }
}
/**
 * Status 412
 * @example
 * throw new PreconditionFailedError("message");
 */
export class PreconditionFailedError extends NHttpError {
  constructor(message: any) {
    super(message, 412, "PreconditionFailedError");
  }
}
/**
 * Status 413
 * @example
 * throw new RequestEntityTooLargeError("message");
 */
export class RequestEntityTooLargeError extends NHttpError {
  constructor(message: any) {
    super(message, 413, "RequestEntityTooLargeError");
  }
}
/**
 * Status 414
 * @example
 * throw new RequestURITooLongError("message");
 */
export class RequestURITooLongError extends NHttpError {
  constructor(message: any) {
    super(message, 414, "RequestURITooLongError");
  }
}
/**
 * Status 415
 * @example
 * throw new UnsupportedMediaTypeError("message");
 */
export class UnsupportedMediaTypeError extends NHttpError {
  constructor(message: any) {
    super(message, 415, "UnsupportedMediaTypeError");
  }
}
/**
 * Status 416
 * @example
 * throw new RequestedRangeNotSatisfiableError("message");
 */
export class RequestedRangeNotSatisfiableError extends NHttpError {
  constructor(message: any) {
    super(message, 416, "RequestedRangeNotSatisfiableError");
  }
}
/**
 * Status 417
 * @example
 * throw new ExpectationFailedError("message");
 */
export class ExpectationFailedError extends NHttpError {
  constructor(message: any) {
    super(message, 417, "ExpectationFailedError");
  }
}
/**
 * Status 418
 * @example
 * throw new TeapotError("message");
 */
export class TeapotError extends NHttpError {
  constructor(message: any) {
    super(message, 418, "TeapotError");
  }
}
/**
 * Status 421
 * @example
 * throw new MisdirectedRequestError("message");
 */
export class MisdirectedRequestError extends NHttpError {
  constructor(message: any) {
    super(message, 421, "MisdirectedRequestError");
  }
}
/**
 * Status 422
 * @example
 * throw new UnprocessableEntityError("message");
 */
export class UnprocessableEntityError extends NHttpError {
  constructor(message: any) {
    super(message, 422, "UnprocessableEntityError");
  }
}
/**
 * Status 423
 * @example
 * throw new LockedError("message");
 */
export class LockedError extends NHttpError {
  constructor(message: any) {
    super(message, 423, "LockedError");
  }
}
/**
 * Status 424
 * @example
 * throw new FailedDependencyError("message");
 */
export class FailedDependencyError extends NHttpError {
  constructor(message: any) {
    super(message, 424, "FailedDependencyError");
  }
}
/**
 * Status 425
 * @example
 * throw new TooEarlyError("message");
 */
export class TooEarlyError extends NHttpError {
  constructor(message: any) {
    super(message, 425, "TooEarlyError");
  }
}
/**
 * Status 426
 * @example
 * throw new UpgradeRequiredError("message");
 */
export class UpgradeRequiredError extends NHttpError {
  constructor(message: any) {
    super(message, 426, "UpgradeRequiredError");
  }
}
/**
 * Status 428
 * @example
 * throw new PreconditionRequiredError("message");
 */
export class PreconditionRequiredError extends NHttpError {
  constructor(message: any) {
    super(message, 428, "PreconditionRequiredError");
  }
}
/**
 * Status 429
 * @example
 * throw new TooManyRequestsError("message");
 */
export class TooManyRequestsError extends NHttpError {
  constructor(message: any) {
    super(message, 429, "TooManyRequestsError");
  }
}
/**
 * Status 431
 * @example
 * throw new RequestHeaderFieldsTooLargeError("message");
 */
export class RequestHeaderFieldsTooLargeError extends NHttpError {
  constructor(message: any) {
    super(message, 431, "RequestHeaderFieldsTooLargeError");
  }
}
/**
 * Status 451
 * @example
 * throw new UnavailableForLegalReasonsError("message");
 */
export class UnavailableForLegalReasonsError extends NHttpError {
  constructor(message: any) {
    super(message, 451, "UnavailableForLegalReasonsError");
  }
}

// 5xx
/**
 * Status 500
 * @example
 * throw new InternalServerError("message");
 */
export class InternalServerError extends NHttpError {
  constructor(message: any) {
    super(message, 500, "InternalServerError");
  }
}
/**
 * Status 501
 * @example
 * throw new NotImplementedError("message");
 */
export class NotImplementedError extends NHttpError {
  constructor(message: any) {
    super(message, 501, "NotImplementedError");
  }
}
/**
 * Status 502
 * @example
 * throw new BadGatewayError("message");
 */
export class BadGatewayError extends NHttpError {
  constructor(message: any) {
    super(message, 502, "BadGatewayError");
  }
}
/**
 * Status 503
 * @example
 * throw new ServiceUnavailableError("message");
 */
export class ServiceUnavailableError extends NHttpError {
  constructor(message: any) {
    super(message, 503, "ServiceUnavailableError");
  }
}
/**
 * Status 504
 * @example
 * throw new GatewayTimeoutError("message");
 */
export class GatewayTimeoutError extends NHttpError {
  constructor(message: any) {
    super(message, 504, "GatewayTimeoutError");
  }
}
/**
 * Status 505
 * @example
 * throw new HTTPVersionNotSupportedError("message");
 */
export class HTTPVersionNotSupportedError extends NHttpError {
  constructor(message: any) {
    super(message, 505, "HTTPVersionNotSupportedError");
  }
}
/**
 * Status 506
 * @example
 * throw new VariantAlsoNegotiatesError("message");
 */
export class VariantAlsoNegotiatesError extends NHttpError {
  constructor(message: any) {
    super(message, 506, "VariantAlsoNegotiatesError");
  }
}
/**
 * Status 507
 * @example
 * throw new InsufficientStorageError("message");
 */
export class InsufficientStorageError extends NHttpError {
  constructor(message: any) {
    super(message, 507, "InsufficientStorageError");
  }
}
/**
 * Status 508
 * @example
 * throw new LoopDetectedError("message");
 */
export class LoopDetectedError extends NHttpError {
  constructor(message: any) {
    super(message, 508, "LoopDetectedError");
  }
}
/**
 * Status 510
 * @example
 * throw new NotExtendedError("message");
 */
export class NotExtendedError extends NHttpError {
  constructor(message: any) {
    super(message, 510, "NotExtendedError");
  }
}
/**
 * Status 511
 * @example
 * throw new NetworkAuthenticationRequiredError("message");
 */
export class NetworkAuthenticationRequiredError extends NHttpError {
  constructor(message: any) {
    super(message, 511, "NetworkAuthenticationRequiredError");
  }
}
/**
 * Give error object
 */
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
