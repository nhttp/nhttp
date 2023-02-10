import {
  DocumentBuilder,
  NHttp,
  swagger,
  validationMetadatasToSchemas,
} from "./deps.ts";
import UserController from "./UserController.ts";

export default class Application extends NHttp {
  constructor() {
    super();
    this.use(
      "/api/v1",
      new UserController(),
    );
    const document = new DocumentBuilder()
      .setInfo({
        title: "Rest APIs for amazing app",
        version: "1.0.0",
        description: "This is the amazing app",
      })
      .addServer("http://localhost:8000/api/v1")
      .build();

    swagger(this, "/api-docs", document, { validationMetadatasToSchemas });
  }
}
