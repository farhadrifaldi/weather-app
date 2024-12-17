import { auth } from "@/utils/auth"
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
    const session = await auth()

    console.log(session?.user)
    if (session?.user?.id) {
        try {
            const cities = await prisma.city.findMany({
                where: {
                    userId: session.user.id, // Get cities for the logged-in user
                },
            });
            return new Response(JSON.stringify(cities), {
                status: 200,
                headers: {
                    "Content-Type": "application/json",
                },
            });
        } catch (error) {
            console.error("Error fetching cities:", error);
            return new Response(JSON.stringify({ message: "Internal Server Error" }), {
                status: 500,
            });
        }
    }
}

export async function POST(req: Request) {
    const session = await auth()

    const { name } = await req.json();

    try {
        if (session?.user?.id) {
            const city = await prisma.city.create({
                data: {
                    name: name,
                    userId: session.user.id,
                }
            })

            return new Response(JSON.stringify(city), {
                status: 201,
                headers: {
                    "Content-Type": "application/json",
                },
            });
        }
    } catch (error) {
        console.error("Error saving city:", error);
        return new Response(JSON.stringify({ message: "Internal Server Error" }), {
            status: 500,
        });
    }
}

export async function DELETE(req: Request) {
    const session = await auth()
    const { searchParams } = new URL(req.url)
    const cityId = parseInt(searchParams.get('cityId') as string)

    try {
        if (session?.user?.id) {
            const city = await prisma.city.delete({
                where: {
                    id: cityId
                }
            })

            return new Response(JSON.stringify(city), {
                status: 201,
                headers: {
                    "Content-Type": "application/json",
                },
            });
        }
    } catch (error) {
        console.error("Error saving city:", error);
        return new Response(JSON.stringify({ message: "Internal Server Error" }), {
            status: 500,
        });
    }
}