import { IsEmail, IsString } from "./deps.ts";

export default class UserDto {
  @IsString()
  name!: string;

  @IsEmail()
  email!: string;

  @IsString()
  address!: string;
}
