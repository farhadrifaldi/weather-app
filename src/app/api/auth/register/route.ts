import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { hashString } from '@/utils/encrypt';
import { FormTypes } from '@/types/authFormType';
const prisma = new PrismaClient();

export async function POST(req: Request) {
    const { email, password, name } = (await req.json()) as FormTypes;

    // Validate input
    if (!email || !password) {
        return NextResponse.json({ error: 'All fields are required.' }, { status: 400 });
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
        where: { email },
    });

    if (existingUser) {
        return NextResponse.json({ error: 'User  already exists.' }, { status: 409 });
    }

    // Hash the password
    const hashedPassword = hashString(password as string)

    // Create the user
    const user = await prisma.user.create({
        data: {
            name,
            email,
            password: hashedPassword, // Store the hashed password
        },
    });

    // Return the created user (omit password for security)
    return NextResponse.json({
        id: user.id,
        name: user.name,
        email: user.email,
    }, { status: 201 });
}