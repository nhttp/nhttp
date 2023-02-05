import { Controller, Get, RequestEvent } from "./deps.ts";
import UserService from "./UserService.ts";

@Controller("/user")
class UserController {
  private readonly service = new UserService();

  @Get("/")
  findAll() {
    return this.service.findAll();
  }

  @Get("/:id")
  findById(rev: RequestEvent) {
    const params = rev.params;
    return this.service.findById(params.id);
  }
}

export default UserController;
