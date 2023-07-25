const yogaHandler = (handler) => async (rev) => {
  const resp = await handler(rev.newRequest, rev);
  if (rev.request.raw === void 0)
    return resp;
  return new Response(resp.body, resp);
};
var yoga_default = yogaHandler;
export {
  yoga_default as default,
  yogaHandler
};
