import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';

export type Result<T> =
    | { success: true; data: T }
    | { success: false; error: { message: string; status?: number; context?: Record<string, unknown> } };

export class HttpService {
    private client: AxiosInstance;

    constructor(baseURL = '', headers = {}, timeout = 10000) {
        this.client = axios.create({
            baseURL,
            headers: {
                'Content-Type': 'application/json',
                ...headers
            },
            timeout
        });
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

    private ensureError(value: unknown): Error {
        if (value instanceof Error) {
            return value;
        }

        let stringified = '[Unable to stringify the thrown value]';
        try {
            stringified = JSON.stringify(value);
        } catch {}

        return new Error(`Unknown error: ${stringified}`);
    }

    private handleApiError(error: unknown): Result<never> {
        const err = this.ensureError(error);

        if (axios.isAxiosError(err) && err.response) {
            const status = err.response.status;
            const data = err.response.data as Record<string, unknown>;
            const message = typeof data?.message === 'string'
                ? data.message
                : err.message || 'API Error';

            return this.failure(message, status, data);
        }

        return this.failure(err.message || 'Network Error', 500);
    }

    async get<T>(url: string, params = {}, config: AxiosRequestConfig = {}): Promise<Result<T>> {
        try {
            const response = await this.client.get<T>(url, { ...config, params });
            return this.success(response.data);
        } catch (err: unknown) {
            return this.handleApiError(err);
        }
    }

    async post<T>(url: string, data = {}, config: AxiosRequestConfig = {}): Promise<Result<T>> {
        try {
            const response = await this.client.post<T>(url, data, config);
            return this.success(response.data);
        } catch (err: unknown) {
            return this.handleApiError(err);
        }
    }

    async put<T>(url: string, data = {}, config: AxiosRequestConfig = {}): Promise<Result<T>> {
        try {
            const response = await this.client.put<T>(url, data, config);
            return this.success(response.data);
        } catch (err: unknown) {
            return this.handleApiError(err);
        }
    }

    async patch<T>(url: string, data = {}, config: AxiosRequestConfig = {}): Promise<Result<T>> {
        try {
            const response = await this.client.patch<T>(url, data, config);
            return this.success(response.data);
        } catch (err: unknown) {
            return this.handleApiError(err);
        }
    }

    async delete<T>(url: string, config: AxiosRequestConfig = {}): Promise<Result<T>> {
        try {
            const response = await this.client.delete<T>(url, config);
            return this.success(response.data);
        } catch (err: unknown) {
            return this.handleApiError(err);
        }
    }
}
