import { NextRequest, NextResponse } from 'next/server';
import {HttpService} from "@/lib/http_helper/HttpHelper";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';
const fileService = new HttpService({
    baseURL: API_BASE_URL,
    defaultNextCache: {
        tags: ['file'],
    }
});

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();
        const file = formData.get('file') as File;
        const isPublic = formData.get('isPublic') as string;

        if (!file) {
            return NextResponse.json({ message: 'No file uploaded' }, { status: 400 });
        }

        // Convert File to Buffer
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        // Prepare the request data
        const formDataToSend = new FormData();
        formDataToSend.append('file', new Blob([buffer]), file.name);
        if (isPublic !== undefined) {
            formDataToSend.append('isPublic', isPublic);
        }

        // Use the HttpService to send the file to the backend
        const result = await fileService.post<File>(
            '/file/upload',
            formDataToSend,
        );

        if (result.success) {
            return NextResponse.json(result.data);
        } else {
            return NextResponse.json(
                { message: result.error.message },
                { status: result.error.status || 400 }
            );
        }
    } catch (error) {
        console.error('Error uploading file:', error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}
