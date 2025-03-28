import { FileRepository } from './FileRepository';
import { OperationRepository } from './OperationRepository';
import { SymbolRepository } from './SymbolRepository';

export const fileRepository = new FileRepository();
export const operationRepository = new OperationRepository();
export const symbolRepository = new SymbolRepository();

export { FileRepository, OperationRepository, SymbolRepository };
