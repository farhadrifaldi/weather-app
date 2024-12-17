import { PrismaClient } from "@prisma/client"
// import { PrismaNeon } from "@prisma/adapter-neon"
// import { Pool } from "@neondatabase/serverless"

// const neon = new Pool({
//     connectionString: process.env.DATABASE_URL,
// })
// const adapter = new PrismaNeon(neon)

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient }

export const prisma = globalForPrisma.prisma || new PrismaClient()

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma