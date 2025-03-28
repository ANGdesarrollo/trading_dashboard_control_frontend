import { PublicLayout } from "@/layouts/PublicLayout";
import {SymbolTemplate} from "@/features/symbol/template/SymbolTemplate";
import {Suspense} from "react";
import {SymbolTableSkeleton} from "@/features/symbol/molecules/SymbolTableSkeleton";

const Page = () => {
  return (
    <PublicLayout>
        <Suspense fallback={<SymbolTableSkeleton />}>
            <SymbolTemplate />
        </Suspense>
    </PublicLayout>
  );
};

export default Page;
