/**
 * HTTP 客户端封装
 * - 统一 baseURL、超时、JSON 序列化
 * - 统一附加 Authorization 头
 * - 统一错误处理（抛 ApiError）
 */

const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL ?? 'http://localhost:8000';

/** 业务级 API 错误 */
export class ApiError extends Error {
  readonly status: number;
  readonly code?: string;
  readonly payload?: unknown;

  constructor(message: string, status: number, code?: string, payload?: unknown) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
    this.payload = payload;
  }
}

export interface RequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  body?: unknown;
  headers?: Record<string, string>;
  /** 超时毫秒，默认 15s */
  timeoutMs?: number;
  /** 是否需要鉴权（携带 accessToken） */
  authed?: boolean;
  /** 查询参数 */
  query?: Record<string, string | number | boolean | undefined>;
}

/** Token 提供者：由 auth store 在初始化时注入，避免循环依赖 */
let getAccessToken: () => string | undefined = () => undefined;

export const setAccessTokenProvider = (provider: () => string | undefined): void => {
  getAccessToken = provider;
};

const buildUrl = (path: string, query?: RequestOptions['query']): string => {
  const base = API_BASE_URL.replace(/\/$/, '');
  const url = `${base}${path.startsWith('/') ? '' : '/'}${path}`;
  if (!query) return url;
  const params = new URLSearchParams();
  Object.entries(query).forEach(([k, v]) => {
    if (v !== undefined) params.append(k, String(v));
  });
  const qs = params.toString();
  return qs ? `${url}?${qs}` : url;
};

/** 核心请求函数 */
export async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const {
    method = 'GET',
    body,
    headers = {},
    timeoutMs = 15_000,
    authed = true,
    query,
  } = options;

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  const finalHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    ...headers,
  };
  if (authed) {
    const token = getAccessToken();
    if (token) finalHeaders.Authorization = `Bearer ${token}`;
  }

  try {
    const res = await fetch(buildUrl(path, query), {
      method,
      headers: finalHeaders,
      body: body === undefined ? undefined : JSON.stringify(body),
      signal: controller.signal,
    });

    const text = await res.text();
    const data = text ? (safeJsonParse(text) as unknown) : undefined;

    if (!res.ok) {
      const msg =
        (typeof data === 'object' && data !== null && 'message' in data
          ? String((data as { message: unknown }).message)
          : undefined) ?? `HTTP ${res.status}`;
      const code =
        typeof data === 'object' && data !== null && 'code' in data
          ? String((data as { code: unknown }).code)
          : undefined;
      throw new ApiError(msg, res.status, code, data);
    }
    return data as T;
  } finally {
    clearTimeout(timer);
  }
}

const safeJsonParse = (text: string): unknown => {
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
};

/** 常用便捷方法 */
export const api = {
  get: <T>(path: string, options?: Omit<RequestOptions, 'method' | 'body'>) =>
    request<T>(path, { ...options, method: 'GET' }),
  post: <T>(path: string, body?: unknown, options?: Omit<RequestOptions, 'method' | 'body'>) =>
    request<T>(path, { ...options, method: 'POST', body }),
  put: <T>(path: string, body?: unknown, options?: Omit<RequestOptions, 'method' | 'body'>) =>
    request<T>(path, { ...options, method: 'PUT', body }),
  patch: <T>(path: string, body?: unknown, options?: Omit<RequestOptions, 'method' | 'body'>) =>
    request<T>(path, { ...options, method: 'PATCH', body }),
  delete: <T>(path: string, options?: Omit<RequestOptions, 'method' | 'body'>) =>
    request<T>(path, { ...options, method: 'DELETE' }),
};
