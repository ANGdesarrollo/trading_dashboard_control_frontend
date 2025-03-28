import {operationRepository} from "@/features/shared/repositories";

export const SymbolTemplate = async () => {
    const operations = await operationRepository.getAll();

    return (
    <div>

    </div>
  );
};
