## libs class-validator

> this libs for [@nhttp/nhttp](https://jsr.io/@nhttp/nhttp)

## Usage

```ts
import {
  Controller,
  Post,
} from "@nhttp/nhttp/controller";
import {
  IsEmail,
  IsPhoneNumber,
  IsString,
  Validate,
} from "@nhttp/class-validator";

// Person Dto
class PersonDto {
  @IsString()
  name!: string;

  @IsEmail()
  email!: string;

  @IsPhoneNumber()
  phone!: string;
}

// Person Controller
@Controller("/person")
class PersonController {

  // validate
  @Validate(PersonDto)
  @Post("/")
  save() {...}
}
```
