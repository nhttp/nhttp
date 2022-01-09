import { HttpError } from "./deps.ts";

const baseApi = "https://jsonplaceholder.typicode.com";

function fetchWithTimeout(url: string, opts?: RequestInit, timeout = 5000) {
  return Promise.race([
    fetch(baseApi + url, opts),
    new Promise((_, reject) =>
      setTimeout(() => reject(new HttpError(408, "request timeout")), timeout)
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
    throw new HttpError(result.status, `${result.status} ${result.statusText}`);
  }
  const data = await result.json();
  return data;
}
