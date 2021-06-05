
class MyError extends Error {
    status: number;
    constructor(message: string, status = 500) {
        super(message);
        this.status = status;
    }
}

export default class UserService {
  baseApi = "https://jsonplaceholder.typicode.com";

  async findAll() {
    const result = await fetch(this.baseApi + "/users");
    if (!result.ok) {
      throw new MyError(`${result.status} ${result.statusText}`, result.status);
    }
    const data = await result.json();
    return { data, status: 200 };
  }

  async findById(id: number) {
    const result = await fetch(this.baseApi + "/users/" + id);
    if (!result.ok) {
      throw new MyError(`${result.status} ${result.statusText}`, result.status);
    }
    const data = await result.json();
    return { data, status: 200 };
  }
}
