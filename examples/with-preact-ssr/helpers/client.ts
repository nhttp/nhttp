import {
  FunctionComponent as FC,
  h,
  render,
} from "https://esm.sh/stable/preact@10.15.0";

declare global {
  interface Window {
    // deno-lint-ignore no-explicit-any
    __INIT_PROPS__?: any;
  }
}

type FunctionComp<T> = FC<T> & { meta_url?: string };
const withClient = <T extends unknown = unknown>(
  Fc: FunctionComp<T>,
  meta_url: string,
): FunctionComp<T> => {
  if (typeof document === "undefined") {
    Fc.meta_url = meta_url;
  } else {
    const props = window.__INIT_PROPS__ ?? {};
    window.__INIT_PROPS__ = void 0;
    render(h(Fc, props), document.body);
  }
  return Fc;
};

export default withClient;
