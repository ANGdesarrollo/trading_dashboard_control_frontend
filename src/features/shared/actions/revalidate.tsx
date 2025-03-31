"use server";

import {revalidatePath, revalidateTag} from "next/cache";

export const revalidate = async (path: string) => {
    return revalidatePath(path, 'layout');
}

export const tag = async (tag: string) => {
    return revalidateTag(`${tag}`);
}
