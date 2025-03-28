import { BaseRepository } from './BaseRepository';
import {Symbol} from "@/features/shared/interfaces";

export class SymbolRepository extends BaseRepository<Symbol> {
    protected basePath = '/symbol';
}
