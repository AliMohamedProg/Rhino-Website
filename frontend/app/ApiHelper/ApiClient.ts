import {
  LoginDto,
  RegisterDto,
  CategoryDto,
  ProductDto,
  OrderDto,
  SliderDto,
  UserMeDto
} from "./types";

const BASE_URL = (process.env.NEXT_PUBLIC_API_URL || "https://rhino-web.runasp.net").replace(/\/+$/, "");

function buildUrl(path: string) {
  const cleanPath = path.replace(/^\/+/, "");
  return `${BASE_URL}/${cleanPath}`;
}

async function request<T>(method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE", url: string, body?: any): Promise<T> {
  const fullUrl = buildUrl(url);
  console.log(`[ApiClient] Request: ${method} ${fullUrl}`, body || "")

  const options: RequestInit = {
    method,
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  };

  if (body) options.body = JSON.stringify(body);

  let res;
  try {
    res = await fetch(fullUrl, options);
  } catch (err) {
    console.error(`[ApiClient] Request failed for ${url}:`, err);
    throw new Error(`Failed to connect to API at ${fullUrl}`);
  }

  // Handle 401 Unauthorized - attempt to refresh token
  if (res.status === 401) {
    const refreshEndpoints = [
      "api/Auth/RefreshAccessToken",
      "api/auth/RefreshAccessToken",
      "api/Auth/refresh",
      "api/auth/refresh",
      "api/Auth/RefreshToken",
    ];

    let refreshSuccess = false;
    for (const endpoint of refreshEndpoints) {
      try {
        const refreshRes = await fetch(buildUrl(endpoint), {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        });

        if (refreshRes.ok) {
          refreshSuccess = true;
          break;
        }
      } catch (err) {
        console.warn(`[ApiClient] Refresh attempt failed for ${endpoint}`);
      }
    }

    if (refreshSuccess) {
      res = await fetch(fullUrl, options);
    } else {
      console.error("[ApiClient] All refresh attempts failed");
      throw new Error("Unauthorized");
    }
  }

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`API Error ${res.status}: ${text}`);
  }

  const text = await res.text();
  try {
    return text ? JSON.parse(text) : (null as unknown as T);
  } catch (e) {
    return text as unknown as T;
  }
}

export const ApiClient = {
  // Generic methods
  get: <T>(url: string) => request<T>("GET", url),
  post: <T>(url: string, body: any) => request<T>("POST", url, body),
  put: <T>(url: string, body: any) => request<T>("PUT", url, body),
  patch: <T>(url: string, body: any) => request<T>("PATCH", url, body),
  delete: <T>(url: string) => request<T>("DELETE", url),

  // Auth Endpoints
  auth: {
    login: (data: LoginDto) => ApiClient.post<any>("api/Auth/Login", data),
    register: (data: RegisterDto) => ApiClient.post<any>("api/Auth/Register", data),
    logout: () => ApiClient.post<any>("api/Auth/Logout", {}),
    me: () => ApiClient.get<UserMeDto>("api/Auth/me"),
  },

  // Category Endpoints
  category: {
    getAll: () => ApiClient.get<CategoryDto[]>("api/Category"),
    getById: (id: string) => ApiClient.get<CategoryDto>(`api/Category/${id}`),
    create: (data: CategoryDto) => ApiClient.post<CategoryDto>("api/Category", data),
    update: (id: string, data: CategoryDto) => ApiClient.put<CategoryDto>(`api/Category/${id}`, data),
    delete: (id: string) => ApiClient.delete<any>(`api/Category/${id}`),
  },

  // Product Endpoints
  product: {
    getAll: () => ApiClient.get<ProductDto[]>("api/Product"),
    getById: (id: string) => ApiClient.get<ProductDto>(`api/Product/${id}`),
    create: (data: ProductDto) => ApiClient.post<ProductDto>("api/Product", data),
    update: (id: string, data: ProductDto) => ApiClient.put<ProductDto>(`api/Product/${id}`, data),
    delete: (id: string) => ApiClient.delete<any>(`api/Product/${id}`),
  },

  // Order Endpoints
  order: {
    getAll: () => ApiClient.get<OrderDto[]>("api/Order"),
    getById: (id: string) => ApiClient.get<OrderDto>(`api/Order/${id}`),
    create: (data: OrderDto) => ApiClient.post<OrderDto>("api/Order", data),
    update: (id: string, data: OrderDto) => ApiClient.put<OrderDto>(`api/Order/${id}`, data),
    delete: (id: string) => ApiClient.delete<any>(`api/Order/${id}`),
  },

  // Slider Endpoints
  slider: {
    getAll: () => ApiClient.get<SliderDto[]>("api/Slider"),
    getById: (id: string) => ApiClient.get<SliderDto>(`api/Slider/${id}`),
    create: (data: SliderDto) => ApiClient.post<SliderDto>("api/Slider", data),
    update: (id: string, data: SliderDto) => ApiClient.put<SliderDto>(`api/Slider/${id}`, data),
    delete: (id: string) => ApiClient.delete<any>(`api/Slider/${id}`),
  },

  upload: async (urlOrFile: string | File, maybeFile?: File) => {
    let url = "api/Upload/image";
    let file: File;

    if (typeof urlOrFile === "string") {
      url = urlOrFile;
      file = maybeFile as File;
      // Normalize to api/Upload based on backend source
      const lowerUrl = url.toLowerCase().replace(/\/+$/, "");
      if (lowerUrl === "api/upload" || lowerUrl === "api/upload/image") {
        url = "api/Upload";
      }
    } else {
      file = urlOrFile;
    }



    if (!file) throw new Error("ApiClient.upload: No file provided");

    const formData = new FormData();
    formData.append("file", file);
    formData.append("image", file);

    const options: RequestInit = {
      method: "POST",
      body: formData,
      credentials: "include",
    };


    const fullUrl = buildUrl(url);
    console.log(`[ApiClient] Uploading to: ${fullUrl}`);
    const res = await fetch(fullUrl, options);

    if (!res.ok) {
      const errorText = await res.text();
      console.error(`[ApiClient] Upload failed: ${res.status} ${res.statusText}`, errorText);
      throw new Error(`Upload failed (${res.status}): ${errorText || res.statusText}`);
    }

    return res.json();
  },
};


