export type Result<T> =
    | { success: true; data: T }
    | { success: false; error: { message: string; status?: number; context?: Record<string, unknown> } };

interface NextCacheOptions {
    revalidate?: number;
    tags?: string[];
}

export interface HttpServiceConfig {
    baseURL?: string;
    headers?: Record<string, string>;
    defaultNextCache?: NextCacheOptions;
}

export class HttpService {
    private readonly baseURL: string;
    private readonly headers: Record<string, string>;
    private readonly defaultNextCache?: NextCacheOptions;

    constructor({
                    baseURL = '',
                    headers = {},
                    defaultNextCache
                }: HttpServiceConfig = {}) {
        this.baseURL = baseURL;
        this.headers = {
            'Content-Type': 'application/json',
            ...headers
        };
        this.defaultNextCache = defaultNextCache;
    }

    private success<T>(data: T): Result<T> {
        return { success: true, data };
    }

    private failure(message: string, status?: number, context?: Record<string, unknown>): Result<never> {
        return {
            success: false,
            error: { message, status, context }
        };
    }

    private async request<T>(
        method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE',
        url: string,
        options: {
            body?: unknown;
            params?: Record<string, string | number | boolean>;
            headers?: Record<string, string>;
            nextCache?: NextCacheOptions;
        } = {}
    ): Promise<Result<T>> {
        const { body, params, headers, nextCache } = options;

        const queryString = params
            ? `?${new URLSearchParams(params as Record<string, string>).toString()}`
            : '';

        const nextOptions = nextCache ?? this.defaultNextCache;
        const next = nextOptions
            ? {
                next: {
                    revalidate: nextOptions.revalidate,
                    tags: nextOptions.tags
                }
            }
            : {};


        const headersToSend = {
            ...this.headers,
            ...headers
        };

        if (body instanceof FormData) {
            delete headersToSend['Content-Type'];
        }

        try {
            const response = await fetch(`${this.baseURL}${url}${queryString}`, {
                method,
                headers: headersToSend,
                body: body instanceof FormData ? body : body ? JSON.stringify(body) : undefined,
                ...next
            });

            const contentType = response.headers.get('Content-Type');
            const isJson = contentType?.includes('application/json');
            const data = isJson ? await response.json() : null;

            if (!response.ok) {
                const message = typeof data?.message === 'string' ? data.message : response.statusText;
                return this.failure(message, response.status, data ?? undefined);
            }

            return this.success(data as T);
        } catch (error) {
            return this.failure(error instanceof Error ? error.message : 'Unknown error', 500);
        }
    }


    get<T>(
        url: string,
        params?: Record<string, string | number | boolean>,
        nextCache?: NextCacheOptions
    ): Promise<Result<T>> {
        return this.request<T>('GET', url, { params, nextCache });
    }

    post<T>(
        url: string,
        body?: unknown,
        nextCache?: NextCacheOptions
    ): Promise<Result<T>> {
        return this.request<T>('POST', url, { body, nextCache });
    }

    put<T>(url: string, body?: unknown): Promise<Result<T>> {
        return this.request<T>('PUT', url, { body });
    }

    patch<T>(url: string, body?: unknown): Promise<Result<T>> {
        return this.request<T>('PATCH', url, { body });
    }

    delete<T>(url: string): Promise<Result<T>> {
        return this.request<T>('DELETE', url);
    }
}
