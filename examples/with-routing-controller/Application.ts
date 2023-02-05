import { NHttp } from "./deps.ts";
import UserController from "./UserController.ts";

export default class Application extends NHttp {
  constructor() {
    super();
    this.use(
      "/api/v1",
      new UserController(),
    );
  }
}
