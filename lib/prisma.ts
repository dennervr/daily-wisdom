import { PrismaClient } from "../app/generated/prisma/client"
import { PrismaPg } from "@prisma/adapter-pg"

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
})

// const globalForPrisma = global as unknown as PrismaClient

// const prisma = globalForPrisma.prisma || new PrismaClient({
//   adapter,
// })

// if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma

const globalForPrisma = global as unknown as PrismaClient

const prisma = new PrismaClient({
  adapter,
})


export default prisma
