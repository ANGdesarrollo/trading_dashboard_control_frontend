import {BaseDomain} from "@/features/shared/interfaces/BaseDomain";
import { Symbol } from "@/features/shared/interfaces/Symbol";

export enum TradeType {
    LONG = 'LONG',
    SHORT = 'SHORT'
}

// Enum for operation result
export enum Result {
    WON = 'WON',
    LOST = 'LOST',
    BE = 'BE'
}

// Base operation entity that matches OperationDomain from backend
export interface Operation extends BaseDomain {
    symbolId: string;
    symbol?: Symbol;
    fileId: string;
    file?: File;
    type: TradeType;
    pips: number;
    result: Result;
    description?: string;
    date: Date;
}

export interface OperationDto {
    symbolId: string;
    fileId: string;
    type: TradeType;
    pips: number;
    result: Result;
    description?: string;
    date: Date;
}

export interface UpdateOperationDto extends Partial<OperationDto> {}
