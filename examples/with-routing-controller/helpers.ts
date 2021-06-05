const baseApi = "https://jsonplaceholder.typicode.com";

class MyError extends Error {
  status: number;
  constructor(message: string, status = 500) {
    super(message);
    this.status = status;
  }
}

function fetchWithTimeout(url: string, opts?: RequestInit, timeout = 5000) {
  return Promise.race([
    fetch(baseApi + url, opts),
    new Promise((_, reject) =>
      setTimeout(() => reject(new MyError("request timeout", 408)), timeout)
    ),
  ]) as Promise<Response>;
}

export async function fetchApi(
  url: string,
  opts?: RequestInit,
  timeout = 7000,
) {
  const result = await fetchWithTimeout(url, opts, timeout);
  if (!result.ok) {
    throw new MyError(`${result.status} ${result.statusText}`, result.status);
  }
  const data = await result.json();
  return data;
}
