import {HttpService} from "@/lib/http_helper/HttpHelper";
import {NextRequest, NextResponse} from "next/server";
import {UpdateFileDto} from "@/features/shared/interfaces";


const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';
const fileService = new HttpService(`${API_BASE_URL}`);

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');

    try {
        if (id) {
            const result = await fileService.get<File>(`/file/${id}`);

            if (result.success) {
                return NextResponse.json(result.data);
            } else {
                return NextResponse.json(
                    { message: result.error.message },
                    { status: result.error.status || 404 }
                );
            }
        } else {
            const result = await fileService.get<File[]>('/file');

            if (result.success) {
                return NextResponse.json(result.data);
            } else {
                return NextResponse.json(
                    { message: result.error.message },
                    { status: result.error.status || 500 }
                );
            }
        }
    } catch (error) {
        console.error('Error processing request:', error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}

export async function PUT(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');

    if (!id) {
        return NextResponse.json({ message: 'File ID is required' }, { status: 400 });
    }

    try {
        const body = await request.json() as UpdateFileDto;
        const result = await fileService.put<File>(`/file/${id}`, body);

        if (result.success) {
            return NextResponse.json(result.data);
        } else {
            return NextResponse.json(
                { message: result.error.message },
                { status: result.error.status || 400 }
            );
        }
    } catch (error) {
        console.error('Error updating file:', error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}

export async function DELETE(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');

    if (!id) {
        return NextResponse.json({ message: 'File ID is required' }, { status: 400 });
    }

    try {
        const result = await fileService.delete<void>(`/file/${id}`);

        if (result.success) {
            return NextResponse.json({ message: 'File deleted successfully' });
        } else {
            return NextResponse.json(
                { message: result.error.message },
                { status: result.error.status || 400 }
            );
        }
    } catch (error) {
        console.error('Error deleting file:', error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}
