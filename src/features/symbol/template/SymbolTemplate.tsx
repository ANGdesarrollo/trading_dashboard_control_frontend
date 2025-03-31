import React from "react";
import { symbolRepository } from "@/features/shared/repositories";
import {SymbolTable} from "@/features/symbol/molecules/SymbolTable";

export const SymbolTemplate = async () => {
    const result = await symbolRepository.getAll();

    const symbols = result.success ? result.data : [];

    return (
        <SymbolTable symbols={symbols} />
    );
};
