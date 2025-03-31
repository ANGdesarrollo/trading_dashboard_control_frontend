import {symbolRepository} from "@/features/shared/repositories";

interface Props {
    id: string;
}

export const SymbolUpdateTemplate = async ({ id }: Props) => {
    const symbol = await symbolRepository.getById(id);
    return(
        <></>
    )
}
