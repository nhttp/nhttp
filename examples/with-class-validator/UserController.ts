import { Controller, Post, RequestEvent, Status, Validate } from "./deps.ts";
import UserDto from "./UserDto.ts";
import UserService from "./UserService.ts";

@Controller("/user")
class UserController {
  private readonly service = new UserService();

  @Status(201)
  @Validate(UserDto)
  @Post("/")
  save({ body, response }: RequestEvent) {
    const user = <UserDto> body;
    return this.service.save(user, response.statusCode);
  }
}

export default UserController;
