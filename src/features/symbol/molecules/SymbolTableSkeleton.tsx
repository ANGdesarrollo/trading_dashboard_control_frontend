import React from "react";
import { Skeleton } from "@/features/shared/atoms/Skeleton";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/features/shared/organisms/Table";

export const SymbolTableSkeleton = () => {
    return (
        <div className="container mx-auto py-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">
                    <Skeleton className="h-8 w-32" />
                </h1>
                <div className="h-10 w-28">
                    <Skeleton className="h-full w-full rounded-md" />
                </div>
            </div>

            <div className="bg-card rounded-lg shadow-sm">
                <Table>
                    <TableCaption>
                        <Skeleton className="h-4 w-48 mx-auto" />
                    </TableCaption>
                    <TableHeader>
                        <TableRow>
                            <TableHead><Skeleton className="h-4 w-12" /></TableHead>
                            <TableHead><Skeleton className="h-4 w-24" /></TableHead>
                            <TableHead><Skeleton className="h-4 w-36" /></TableHead>
                            <TableHead><Skeleton className="h-4 w-36" /></TableHead>
                            <TableHead className="text-right"><Skeleton className="h-4 w-20 ml-auto" /></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {Array(5).fill(0).map((_, index) => (
                            <TableRow key={index}>
                                <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                                <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                                <TableCell><Skeleton className="h-4 w-36" /></TableCell>
                                <TableCell><Skeleton className="h-4 w-36" /></TableCell>
                                <TableCell className="text-right">
                                    <div className="flex justify-end gap-2">
                                        <Skeleton className="h-8 w-16 rounded-md" />
                                        <Skeleton className="h-8 w-16 rounded-md" />
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
};
