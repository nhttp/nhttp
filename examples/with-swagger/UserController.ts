import {
  ApiDocument,
  ApiOperation,
  ApiParameter,
  ApiResponse,
  BaseController,
  Controller,
  Get,
  Inject,
} from "./deps.ts";
import UserService from "./UserService.ts";

@ApiDocument({
  name: "Doc user 1.0",
  description: "doc user description",
})
@Controller("/users")
class UserController extends BaseController {
  @Inject(UserService)
  private readonly service!: UserService;

  @ApiResponse(200, { description: "OK" })
  @ApiOperation({ summary: "get all users" })
  @Get()
  findAll() {
    return this.service.findAll();
  }

  @ApiParameter({ name: "id", in: "path" })
  @ApiResponse(200, { description: "OK" })
  @ApiOperation({ summary: "find user by ID" })
  @Get("/:id")
  findById() {
    const { params } = this.requestEvent;
    return this.service.findById(params.id);
  }
}

export default UserController;
