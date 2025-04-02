import { PublicLayout } from "@/layouts/PublicLayout";
import { SymbolUpdateTemplate } from "@/features/symbol/template/SymbolUpdateTemplate";
import { Suspense } from "react";

interface PageProps {
    params: Promise<{ id: string }>;
}

const Page = async ({ params }: PageProps) => {
    const resolvedParams = await params;
    const { id } = resolvedParams;

    return (
        <PublicLayout>
            <Suspense>
                <SymbolUpdateTemplate id={id} />
            </Suspense>
        </PublicLayout>
    );
};

export default Page;
