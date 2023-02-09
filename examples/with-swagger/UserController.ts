import {
  ApiDocument,
  ApiOperation,
  ApiParameter,
  ApiResponse,
  Controller,
  Get,
  RequestEvent,
} from "./deps.ts";
import UserService from "./UserService.ts";

@ApiDocument({
  name: "Doc user 1.0",
  description: "doc user description",
})
@Controller("/user")
class UserController {
  private readonly service = new UserService();

  @ApiResponse(200, { description: "OK" })
  @ApiOperation({ summary: "get all users" })
  @Get("/")
  findAll() {
    return this.service.findAll();
  }

  @ApiParameter({ name: "id", in: "path" })
  @ApiResponse(200, { description: "OK" })
  @ApiOperation({ summary: "find user by ID" })
  @Get("/:id")
  findById(rev: RequestEvent) {
    const params = rev.params;
    return this.service.findById(params.id);
  }
}

export default UserController;
