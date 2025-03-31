// utils/operation.ts
import { Result, TradeType } from "@/features/shared/interfaces";

export const getResultText = (result: Result) => {
    switch (result) {
        case Result.WON: return "Ganada";
        case Result.LOST: return "Perdida";
        case Result.BE: return "Empate";
        default: return result;
    }
};

export const getTradeTypeText = (type: TradeType) => {
    switch (type) {
        case TradeType.LONG: return "Compra";
        case TradeType.SHORT: return "Venta";
        default: return type;
    }
};
