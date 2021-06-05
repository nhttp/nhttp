import { fetchApi } from "./helpers.ts";

export default class UserService {
  async findAll() {
    const data = await fetchApi("/users");
    return { data, status: 200 };
  }

  async findById(id: number) {
    const data = await fetchApi("/users/" + id);
    return { data, status: 200 };
  }
}
