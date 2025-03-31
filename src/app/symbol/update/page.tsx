import { PublicLayout } from "@/layouts/PublicLayout";
import {SymbolUpdateTemplate} from "@/features/symbol/template/SymbolUpdateTemplate";
import {Suspense} from "react";

interface Props {
    params: {
        id: string;
    };
}
const Page = ({ params }: Props) => {
    const { id } = params;
    return (
        <PublicLayout>
            <Suspense>
                <SymbolUpdateTemplate id={id} />
            </Suspense>
        </PublicLayout>
    );
};

export default Page;
