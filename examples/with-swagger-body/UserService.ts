import UserDto from "./UserDto.ts";

export default class UserService {
  save(user: UserDto) {
    return { data: user, status: 201 };
  }
}
