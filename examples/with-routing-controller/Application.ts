import { addControllers, NHttp } from "./deps.ts";
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
    this.onError((err) => {
      return {
        message: err.message || "Something went wrong",
        status: err.status || 500,
      };
    });
    this.on404(({ url }) => {
      return {
        message: `${url} not found`,
        status: 404,
      };
    });
  }
}
