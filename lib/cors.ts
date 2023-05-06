import { Handler, TRet } from "./deps.ts";

type TOptions = {
  origin?: string | string[] | boolean;
  credentials?: boolean;
  allowHeaders?: string | string[];
  allowMethods?: string | string[];
  customHeaders?: Record<string, string>;
  optionsStatus?: number;
};

export const cors = (opts: TOptions = {}): Handler => (rev, next) => {
  if (opts.origin !== false) {
    if (opts.origin === true) opts.origin = "*";
    rev.response.setHeader(
      "access-control-allow-origin",
      opts.origin?.toString() ?? "*",
    );
  }
  opts.optionsStatus ??= 204;
  if (opts.credentials) {
    rev.response.setHeader("access-control-allow-credentials", "true");
  }
  if (opts.allowHeaders) {
    rev.response.setHeader(
      "access-control-allow-headers",
      opts.allowHeaders.toString(),
    );
  }
  if (opts.allowMethods) {
    rev.response.setHeader(
      "access-control-allow-methods",
      opts.allowMethods.toString(),
    );
  }
  if (opts.customHeaders) rev.response.header(opts.customHeaders);
  if (rev.request.method === "OPTIONS") {
    rev.response.status(opts.optionsStatus);
    return <TRet> null;
  }
  return next();
};

export default cors;
