import {BaseDomain} from "@/features/shared/interfaces/BaseDomain";
import { Symbol } from "@/features/shared/interfaces/Symbol";
import { File } from "@/features/shared/interfaces/File";

export enum TradeType {
    LONG = 'LONG',
    SHORT = 'SHORT'
}

// Enum for symbol result
export enum Result {
    WON = 'WON',
    LOST = 'LOST',
    BE = 'BE'
}

// Base symbol entity that matches OperationDomain from backend
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
