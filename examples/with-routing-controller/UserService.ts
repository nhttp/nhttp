export default class UserService {
  baseApi = "https://jsonplaceholder.typicode.com";

  async findAll() {
    const result = await fetch(this.baseApi + "/users");
    if (!result.ok) {
      throw new Error(`${result.status} ${result.statusText}`);
    }
    const data = await result.json();
    return { data, status: 200 };
  }

  async findById(id: number) {
    const result = await fetch(this.baseApi + "/users/" + id);
    if (!result.ok) {
      throw new Error(`${result.status} ${result.statusText}`);
    }
    const data = await result.json();
    return { data, status: 200 };
  }
}
