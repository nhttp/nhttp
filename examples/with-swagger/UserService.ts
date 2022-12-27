import { fetchApi } from "./helpers.ts";

export default class UserService {
  // deno-lint-ignore no-explicit-any
  private db: (param?: any) => Promise<any>;

  constructor() {
    this.db = (param) => fetchApi("/users" + (param ? ("/" + param) : ""));
  }

  async findAll() {
    const data = await this.db();
    return { data, status: 200 };
  }

  async findById(id: number) {
    const data = await this.db(id);
    return { data, status: 200 };
  }
}
