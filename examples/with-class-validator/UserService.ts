import UserDto from "./UserDto.ts";

export default class UserService {
  // just dummy UserService.save.
  save(user: UserDto, status: number) {
    return { user, status };
  }
}
