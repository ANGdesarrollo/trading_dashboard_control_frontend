import { NextRequest, NextResponse } from 'next/server';
import {HttpService} from "@/lib/http_helper/HttpHelper";
import {Operation, OperationDto, UpdateOperationDto} from "@/features/shared/interfaces";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';
const operationService = new HttpService(`${API_BASE_URL}`);

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');

    try {
        if (id) {
            // Get operation by ID
            const result = await operationService.get<Operation>(`/trading/${id}`);

            if (result.success) {
                return NextResponse.json(result.data);
            } else {
                return NextResponse.json(
                    { message: result.error.message },
                    { status: result.error.status || 404 }
                );
            }
        } else {
            // List all operations
            const result = await operationService.get<Operation[]>('/trading');

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

export async function POST(request: NextRequest) {
    try {
        const body = await request.json() as OperationDto;

        const result = await operationService.post<Operation>('/trading', body);

        if (result.success) {
            return NextResponse.json(result.data);
        } else {
            return NextResponse.json(
                { message: result.error.message },
                { status: result.error.status || 400 }
            );
        }
    } catch (error) {
        console.error('Error creating operation:', error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}

export async function PUT(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');

    if (!id) {
        return NextResponse.json({ message: 'Operation ID is required' }, { status: 400 });
    }

    try {
        const body = await request.json() as UpdateOperationDto;

        const result = await operationService.put<Operation>(`/trading/${id}`, body);

        if (result.success) {
            return NextResponse.json(result.data);
        } else {
            return NextResponse.json(
                { message: result.error.message },
                { status: result.error.status || 400 }
            );
        }
    } catch (error) {
        console.error('Error updating operation:', error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}

export async function DELETE(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');

    if (!id) {
        return NextResponse.json({ message: 'Operation ID is required' }, { status: 400 });
    }

    try {
        const result = await operationService.delete<void>(`/trading/${id}`);

        if (result.success) {
            return NextResponse.json({ message: 'Operation deleted successfully' });
        } else {
            return NextResponse.json(
                { message: result.error.message },
                { status: result.error.status || 400 }
            );
        }
    } catch (error) {
        console.error('Error deleting operation:', error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}
