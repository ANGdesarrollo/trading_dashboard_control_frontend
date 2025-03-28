import { NextRequest, NextResponse } from 'next/server';
import {HttpService} from "@/lib/http_helper/HttpHelper";
import {Symbol, SymbolDto, UpdateSymbolDto} from "@/features/shared/interfaces";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';
const symbolService = new HttpService(`${API_BASE_URL}`);

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');

    try {
        if (id) {
            // Get symbol by ID
            const result = await symbolService.get<Symbol>(`/symbol/${id}`);

            if (result.success) {
                return NextResponse.json(result.data);
            } else {
                return NextResponse.json(
                    { message: result.error.message },
                    { status: result.error.status || 404 }
                );
            }
        } else {
            // List all symbols
            const result = await symbolService.get<Symbol[]>('/symbol');

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
        const body = await request.json() as SymbolDto;
        const result = await symbolService.post<Symbol>('/symbol', body);

        if (result.success) {
            return NextResponse.json(result.data);
        } else {
            return NextResponse.json(
                { message: result.error.message },
                { status: result.error.status || 400 }
            );
        }
    } catch (error) {
        console.error('Error creating symbol:', error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}

export async function PUT(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');

    if (!id) {
        return NextResponse.json({ message: 'Symbol ID is required' }, { status: 400 });
    }

    try {
        const body = await request.json() as UpdateSymbolDto;
        const result = await symbolService.put<Symbol>(`/symbol/${id}`, body);

        if (result.success) {
            return NextResponse.json(result.data);
        } else {
            return NextResponse.json(
                { message: result.error.message },
                { status: result.error.status || 400 }
            );
        }
    } catch (error) {
        console.error('Error updating symbol:', error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}

export async function DELETE(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');

    if (!id) {
        return NextResponse.json({ message: 'Symbol ID is required' }, { status: 400 });
    }

    try {
        const result = await symbolService.delete<void>(`/symbol/${id}`);

        if (result.success) {
            return NextResponse.json({ message: 'Symbol deleted successfully' });
        } else {
            return NextResponse.json(
                { message: result.error.message },
                { status: result.error.status || 400 }
            );
        }
    } catch (error) {
        console.error('Error deleting symbol:', error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}
