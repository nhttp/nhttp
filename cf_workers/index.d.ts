export var HttpError: {
    new (status: any, message: any, name: any): {
        message: any;
        status: any;
        name: any;
        stack?: string;
    };
};
export var HttpResponse: {
    new (): {};
};
export var JsonResponse: {
    new (body: any, resInit?: {}): {
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
export var NHttp: {
    new ({ parseQuery: parseQuery2, bodyLimit, env }?: {
        parseQuery: any;
        bodyLimit: any;
        env: any;
    }): {
        parseQuery: any;
        multipartParseQuery: any;
        bodyLimit: any;
        env: any;
        onError(fn: any): any;
        _onError(err: any, rev: any, _: any): any;
        on404(fn: any): any;
        _on404(rev: any, _: any): any;
        use(...args: any[]): any;
        midds: any[];
        pmidds: any;
        on(method: any, path: any, ...handlers: any[]): any;
        handle(rev: any, isRw: any): any;
        handleEvent(event: any): any;
        listen(opts: any, callback: any): Promise<void>;
        server: any;
        handleConn(conn: any): Promise<void>;
        withPromise(handler: any, rev: any, next: any, isDepError: any): Promise<any>;
        route: {};
        c_routes: any[];
        base: string;
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
        single(mtd: any, url: any): {
            params: {};
            fns: any;
        };
        find(method: any, url: any, fn404: any): {
            params: {};
            fns: any;
        };
    };
};
export var RequestEvent: {
    new (): {};
};
export var Router: {
    new ({ base: base2 }?: {
        base?: string;
    }): {
        route: {};
        c_routes: any[];
        midds: any[];
        base: string;
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
        single(mtd: any, url: any): {
            params: {};
            fns: any;
        };
        on(method: any, path: any, ...handlers: any[]): any;
        find(method: any, url: any, fn404: any): {
            params: {};
            fns: any;
        };
    };
};
export function expressMiddleware(...middlewares: any[]): any[];
export function getError(err: any, isStack: any): {
    status: any;
    message: any;
    name: any;
    stack: any;
};
export var multipart: {
    createBody(formData: any, { parse }?: {
        parse: any;
    }): any;
    cleanUp(body: any): void;
    validate(files: any, opts: any): void;
    privUpload(files: any, opts: any): Promise<void>;
    upload(options: any): (rev: any, next: any) => Promise<any>;
};
