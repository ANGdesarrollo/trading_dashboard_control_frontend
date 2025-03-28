import {BaseDomain} from "@/features/shared/interfaces/BaseDomain";

export interface Symbol extends BaseDomain {
    name: string;
}

export interface SymbolDto {
    name: string;
}

export interface UpdateSymbolDto extends Partial<SymbolDto> {}
