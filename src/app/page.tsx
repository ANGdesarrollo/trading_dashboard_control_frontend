import {operationRepository} from "@/features/shared/repositories";

export default async function Home() {
  const operations = await operationRepository.getAll();
  console.log(operations);
  return (
    <div>

    </div>
  );
}
