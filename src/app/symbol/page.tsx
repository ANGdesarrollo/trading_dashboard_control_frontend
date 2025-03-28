import { PublicLayout } from "@/layouts/PublicLayout";
import {SymbolTemplate} from "@/features/symbol/template/SymbolTemplate";
import {Suspense} from "react";
import {Skeleton} from "@/features/shared/atoms/Skeleton";

const Page = () => {
  return (
    <PublicLayout>
        <Suspense fallback={<Skeleton />}>
            <SymbolTemplate />
        </Suspense>
    </PublicLayout>
  );
};

export default Page;
