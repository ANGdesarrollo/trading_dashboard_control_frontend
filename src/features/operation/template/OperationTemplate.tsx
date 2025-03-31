import React from "react";
import {operationRepository, symbolRepository} from "@/features/shared/repositories";
import { OperationTable } from "@/features/operation/molecules/OperationTable";

export const OperationTemplate = async () => {
    const resultOperation = await operationRepository.getAll();
    const operations = resultOperation.success ?  resultOperation.data : [];
    const resultSymbol = await symbolRepository.getAll();
    const symbols = resultSymbol.success ? resultSymbol.data : [];
    console.log(symbols)
    return (
        <OperationTable operations={operations} symbols={symbols} />
    );
};
