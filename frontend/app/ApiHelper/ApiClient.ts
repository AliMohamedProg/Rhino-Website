// app/helpers/ApiClient.ts
const BASE_URL = "https://localhost:7282/";

async function request(method: "GET" | "POST" | "PATCH" | "DELETE", url: string, body?: any): Promise<any> {
  const options: RequestInit = {
    method,
    headers: { "Content-Type": "application/json" },
    credentials: "include", // مهم جدًا عشان الكوكي يوصل
  };

  if (body) options.body = JSON.stringify(body);

  let res = await fetch(BASE_URL + url, options);

  // لو حصل 401 ممكن نعمل refresh تلقائي
  if (res.status === 401) {
    // refresh token موجود في HttpOnly cookie
    const refreshRes = await fetch(BASE_URL + "api/auth/RefreshAccessToken", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });

    if (refreshRes.ok) {
      // جرب الطلب مرة تانية بعد تجديد التوكن
      res = await fetch(BASE_URL + url, options);
    } else {
      throw new Error("Unauthorized, refresh failed");
    }
  }

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`API Error ${res.status}: ${text}`);
  }

  return res.json();
}

export const ApiClient = {
  get: (url: string) => request("GET", url),
  post: (url: string, body: any) => request("POST", url, body),
  patch: (url: string, body: any) => request("PATCH", url, body),
  delete: (url: string) => request("DELETE", url),
};
