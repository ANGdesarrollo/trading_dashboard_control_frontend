import { BaseRepository } from './BaseRepository';
import {Result} from "@/lib/http_helper/HttpHelper";
import {File as FileDomain} from "@/features/shared/interfaces";

export class FileRepository extends BaseRepository<FileDomain> {
    protected basePath = '/file';

    upload(file: File | Blob, isPublic = true): Promise<Result<FileDomain>> {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('isPublic', isPublic.toString());

        return this.httpService.post<FileDomain>(
            '/file/upload',
            formData,
        );
    }
}
