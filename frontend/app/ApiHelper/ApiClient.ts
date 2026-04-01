// app/helpers/ApiClient.ts
const BASE_URL = (process.env.NEXT_PUBLIC_API_URL || "https://localhost:7282").replace(/\/+$/, "") + "/";

async function request(method: "GET" | "POST" | "PATCH" | "DELETE", url: string, body?: any): Promise<any> {
  console.log(`[ApiClient] Request: ${method} ${BASE_URL}${url}`, body || "")
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

  const text = await res.text();
  try {
    return text ? JSON.parse(text) : null;
  } catch (e) {
    return text;
  }
}

export const ApiClient = {
  get: (url: string) => request("GET", url),
  post: (url: string, body: any) => request("POST", url, body),
  patch: (url: string, body: any) => request("PATCH", url, body),
  delete: (url: string) => request("DELETE", url),
  upload: async (url: string, file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    const options: RequestInit = {
      method: "POST",
      body: formData,
      credentials: "include",
    };
    const res = await fetch(BASE_URL + url, options);
    if (!res.ok) throw new Error(`Upload failed: ${res.statusText}`);
    return res.json();
  },
};
