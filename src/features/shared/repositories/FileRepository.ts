import { BaseRepository } from './BaseRepository';
import {Result} from "@/lib/http_helper/HttpHelper";

export class FileRepository extends BaseRepository<File> {
    protected basePath = '/file';

    upload(file: File | Blob, isPublic = true): Promise<Result<File>> {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('isPublic', isPublic.toString());

        return this.httpService.post<File>(
            '/file/upload',
            formData,
        );
    }
}
