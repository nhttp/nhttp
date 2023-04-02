import {
  ApiDocument,
  ApiOperation,
  ApiRequestBody,
  ApiResponse,
  Controller,
  Post,
  RequestEvent,
  Status,
  Validate,
} from "./deps.ts";
import UserDto from "./UserDto.ts";
import UserService from "./UserService.ts";

@ApiDocument({
  name: "Doc user 1.0",
  description: "doc user description",
})
@Controller("/user")
class UserController {
  private readonly service = new UserService();

  @ApiRequestBody({
    description: "Body User",
    required: true,
    schema: UserDto,
  })
  @ApiResponse(201, { description: "Created" })
  @ApiOperation({ summary: "save user" })
  @Status(201)
  @Validate(UserDto)
  @Post("/")
  save(rev: RequestEvent) {
    return this.service.save(<UserDto> rev.body);
  }
}

export default UserController;
