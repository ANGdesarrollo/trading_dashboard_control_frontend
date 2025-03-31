import { BaseRepository } from './BaseRepository';
import {Operation} from "@/features/shared/interfaces";

export class OperationRepository extends BaseRepository<Operation> {
    protected basePath = '/operation';
}
