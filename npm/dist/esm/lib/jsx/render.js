import { Helmet } from "./helmet.js";
import { n } from "./index.js";
import { isValidElement } from "./is-valid-element.js";
const renderToString = (elem) => elem;
const options = {
  onRenderHtml: (html) => html,
  onRenderElement: renderToString
};
const toHtml = (body, { head, footer, attr }) => {
  return "<!DOCTYPE html>" + n("html", { lang: "en", ...attr.html.toJSON() }, [
    n("head", {}, [
      n("meta", { charset: "utf-8" }),
      n("meta", {
        name: "viewport",
        content: "width=device-width, initial-scale=1.0"
      }),
      head
    ]),
    n("body", attr.body.toJSON(), [body, footer])
  ]);
};
const renderToHtml = (elem, rev) => {
  const body = options.onRenderElement(elem, rev);
  const render = (str) => {
    return options.onRenderHtml(toHtml(str, Helmet.rewind()), rev);
  };
  if (body instanceof Promise)
    return body.then(render);
  return render(body);
};
renderToHtml.check = isValidElement;
export {
  isValidElement,
  options,
  renderToHtml,
  renderToString
};
