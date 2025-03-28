import {HttpService, Result} from "@/lib/http_helper/HttpHelper";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:3000/api";
const httpService = new HttpService(API_BASE_URL);

export abstract class BaseRepository<T>
{
    protected httpService = httpService;
    protected abstract basePath: string;

    getAll(): Promise<Result<T[]>>
    {
        return this.httpService.get<T[]>(this.basePath);
    }

    getById(id: string): Promise<Result<T>>
    {
        return this.httpService.get<T>(`${this.basePath}?id=${id}`);
    }

    create(data: Partial<T>): Promise<Result<T>>
    {
        return this.httpService.post<T>(this.basePath, data);
    }

    update(id: string, data: Partial<T>): Promise<Result<T>>
    {
        return this.httpService.put<T>(`${this.basePath}?id=${id}`, data);
    }

    delete(id: string): Promise<Result<void>>
    {
        return this.httpService.delete<void>(`${this.basePath}?id=${id}`);
    }
}
