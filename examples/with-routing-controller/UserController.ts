import { BaseController, Controller, Get, Inject } from "./deps.ts";
import UserService from "./UserService.ts";

@Controller("/users")
class UserController extends BaseController {
  @Inject(UserService)
  private readonly service!: UserService;

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get("/:id")
  findById() {
    const { params } = this.rev;
    return this.service.findById(params.id);
  }
}

export default UserController;
