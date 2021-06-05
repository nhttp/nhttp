import { addControllers, JsonResponse, NHttp } from "./deps.ts";
import UserController from "./UserController.ts";

export default class Application extends NHttp {
  constructor() {
    super();
    this.use(
      "/api/v1",
      addControllers([
        UserController,
      ]),
    );
    this.onError((err, { respondWith }) => {
      const responseInit = { status: err.status || 500 };
      const errData = {
        message: err.message || "Something went wrong",
        status: responseInit.status,
      };
      respondWith(new JsonResponse(errData, responseInit));
    });
    this.on404(({ respondWith, url }) => {
      const responseInit = { status: 404 };
      const errData = { message: `${url} not found`, status: 404 };
      respondWith(new JsonResponse(errData, responseInit));
    });
  }
}
