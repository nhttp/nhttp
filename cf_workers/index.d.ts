// deno-lint-ignore-file
export var BadGatewayError: {
  new (message: any): {
    message: any;
    status: number;
    name: any;
    stack?: string;
  };
};
export var BadRequestError: {
  new (message: any): {
    message: any;
    status: number;
    name: any;
    stack?: string;
  };
};
export var ConflictError: {
  new (message: any): {
    message: any;
    status: number;
    name: any;
    stack?: string;
  };
};
export var ExpectationFailedError: {
  new (message: any): {
    message: any;
    status: number;
    name: any;
    stack?: string;
  };
};
export var FailedDependencyError: {
  new (message: any): {
    message: any;
    status: number;
    name: any;
    stack?: string;
  };
};
export var ForbiddenError: {
  new (message: any): {
    message: any;
    status: number;
    name: any;
    stack?: string;
  };
};
export var GatewayTimeoutError: {
  new (message: any): {
    message: any;
    status: number;
    name: any;
    stack?: string;
  };
};
export var GoneError: {
  new (message: any): {
    message: any;
    status: number;
    name: any;
    stack?: string;
  };
};
export var HTTPVersionNotSupportedError: {
  new (message: any): {
    message: any;
    status: number;
    name: any;
    stack?: string;
  };
};
export var HttpResponse: {
  new (): {};
};
export var InsufficientStorageError: {
  new (message: any): {
    message: any;
    status: number;
    name: any;
    stack?: string;
  };
};
export var InternalServerError: {
  new (message: any): {
    message: any;
    status: number;
    name: any;
    stack?: string;
  };
};
export var JsonResponse: {
  new (json: any, opts?: {}): {
    readonly headers: Headers;
    readonly ok: boolean;
    readonly redirected: boolean;
    readonly status: number;
    readonly statusText: string;
    readonly trailer: Promise<Headers>;
    readonly type: ResponseType;
    readonly url: string;
    clone(): Response;
    readonly body: ReadableStream<Uint8Array>;
    readonly bodyUsed: boolean;
    arrayBuffer(): Promise<ArrayBuffer>;
    blob(): Promise<Blob>;
    formData(): Promise<FormData>;
    json(): Promise<any>;
    text(): Promise<string>;
  };
  error(): Response;
  redirect(url: string, status?: number): Response;
};
export var LengthRequiredError: {
  new (message: any): {
    message: any;
    status: number;
    name: any;
    stack?: string;
  };
};
export var LockedError: {
  new (message: any): {
    message: any;
    status: number;
    name: any;
    stack?: string;
  };
};
export var LoopDetectedError: {
  new (message: any): {
    message: any;
    status: number;
    name: any;
    stack?: string;
  };
};
export var MethodNotAllowedError: {
  new (message: any): {
    message: any;
    status: number;
    name: any;
    stack?: string;
  };
};
export var MisdirectedRequestError: {
  new (message: any): {
    message: any;
    status: number;
    name: any;
    stack?: string;
  };
};
export var NHttp: {
  new ({ parseQuery: parseQuery2, bodyLimit, env }?: {
    parseQuery: any;
    bodyLimit: any;
    env: any;
  }): {
    fetchEventHandler(): (event: any) => Promise<void>;
    onError(fn: any): void;
    on404(fn: any): void;
    use(...args: any[]): any;
    midds: any[];
    on(method: any, path: any, ...handlers: any[]): any;
    handle(rev: any, i?: number): void;
    listen(opts: any, callback: any): Promise<void>;
    server: any;
    route: {};
    c_routes: any[];
    pmidds: {};
    get: any;
    post: any;
    put: any;
    patch: any;
    delete: any;
    any: any;
    head: any;
    options: any;
    trace: any;
    connect: any;
    findRoute(method: any, url: any, notFound: any): {
      params: {
        wild: any;
      };
      handlers: any;
    };
  };
};
export var NHttpError: {
  new (message: any, status: number, name: any): {
    message: any;
    status: number;
    name: any;
    stack?: string;
  };
};
export var NetworkAuthenticationRequiredError: {
  new (message: any): {
    message: any;
    status: number;
    name: any;
    stack?: string;
  };
};
export var NotAcceptableError: {
  new (message: any): {
    message: any;
    status: number;
    name: any;
    stack?: string;
  };
};
export var NotExtendedError: {
  new (message: any): {
    message: any;
    status: number;
    name: any;
    stack?: string;
  };
};
export var NotFoundError: {
  new (message: any): {
    message: any;
    status: number;
    name: any;
    stack?: string;
  };
};
export var NotImplementedError: {
  new (message: any): {
    message: any;
    status: number;
    name: any;
    stack?: string;
  };
};
export var PaymentRequiredError: {
  new (message: any): {
    message: any;
    status: number;
    name: any;
    stack?: string;
  };
};
export var PreconditionFailedError: {
  new (message: any): {
    message: any;
    status: number;
    name: any;
    stack?: string;
  };
};
export var PreconditionRequiredError: {
  new (message: any): {
    message: any;
    status: number;
    name: any;
    stack?: string;
  };
};
export var ProxyAuthRequiredError: {
  new (message: any): {
    message: any;
    status: number;
    name: any;
    stack?: string;
  };
};
export var RequestEntityTooLargeError: {
  new (message: any): {
    message: any;
    status: number;
    name: any;
    stack?: string;
  };
};
export var RequestEvent: {
  new (): {};
};
export var RequestHeaderFieldsTooLargeError: {
  new (message: any): {
    message: any;
    status: number;
    name: any;
    stack?: string;
  };
};
export var RequestTimeoutError: {
  new (message: any): {
    message: any;
    status: number;
    name: any;
    stack?: string;
  };
};
export var RequestURITooLongError: {
  new (message: any): {
    message: any;
    status: number;
    name: any;
    stack?: string;
  };
};
export var RequestedRangeNotSatisfiableError: {
  new (message: any): {
    message: any;
    status: number;
    name: any;
    stack?: string;
  };
};
export var Router: {
  new (): {
    route: {};
    c_routes: any[];
    midds: any[];
    pmidds: {};
    get: any;
    post: any;
    put: any;
    patch: any;
    delete: any;
    any: any;
    head: any;
    options: any;
    trace: any;
    connect: any;
    on(method: any, path: any, ...handlers: any[]): any;
    findRoute(method: any, url: any, notFound: any): {
      params: {
        wild: any;
      };
      handlers: any;
    };
  };
};
export var ServiceUnavailableError: {
  new (message: any): {
    message: any;
    status: number;
    name: any;
    stack?: string;
  };
};
export var TeapotError: {
  new (message: any): {
    message: any;
    status: number;
    name: any;
    stack?: string;
  };
};
export var TooEarlyError: {
  new (message: any): {
    message: any;
    status: number;
    name: any;
    stack?: string;
  };
};
export var TooManyRequestsError: {
  new (message: any): {
    message: any;
    status: number;
    name: any;
    stack?: string;
  };
};
export var UnauthorizedError: {
  new (message: any): {
    message: any;
    status: number;
    name: any;
    stack?: string;
  };
};
export var UnavailableForLegalReasonsError: {
  new (message: any): {
    message: any;
    status: number;
    name: any;
    stack?: string;
  };
};
export var UnprocessableEntityError: {
  new (message: any): {
    message: any;
    status: number;
    name: any;
    stack?: string;
  };
};
export var UnsupportedMediaTypeError: {
  new (message: any): {
    message: any;
    status: number;
    name: any;
    stack?: string;
  };
};
export var UpgradeRequiredError: {
  new (message: any): {
    message: any;
    status: number;
    name: any;
    stack?: string;
  };
};
export var VariantAlsoNegotiatesError: {
  new (message: any): {
    message: any;
    status: number;
    name: any;
    stack?: string;
  };
};
export function getError(err: any, isStack: any): {
  status: any;
  message: any;
  name: any;
  stack: any;
};
export var multipart: {
  createBody: (formData: any, { parse }?: {
    parse: any;
  }) => any;
  upload(options: any): (rev: any, next: any) => Promise<void>;
};
export function wrapMiddleware(
  ...middlewares: any[]
): (rev: any, next: any) => any;
