import { Controller, Get, Inject, RequestEvent } from "./deps.ts";
import UserService from "./UserService.ts";

@Controller("/users")
export default class UserController {
  @Inject(UserService)
  private readonly service!: UserService;

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get("/:id")
  findById({ params }: RequestEvent) {
    return this.service.findById(params.id as number);
  }
}
