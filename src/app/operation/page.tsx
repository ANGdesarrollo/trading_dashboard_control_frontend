import { PublicLayout } from "@/layouts/PublicLayout";
import { OperationTemplate } from "@/features/operation/template/OperationTemplate";
import { Suspense } from "react";
import { OperationTableSkeleton } from "@/features/operation/molecules/OperationTableSkeleton";

const Page = () => {
    return (
        <PublicLayout>
            <Suspense fallback={<OperationTableSkeleton />}>
                <OperationTemplate />
            </Suspense>
        </PublicLayout>
    );
};

export default Page;
