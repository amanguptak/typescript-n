import { PrismaClient ,Prisma } from "@prisma/client";

const db = new PrismaClient({
    log:["query"]
})

export default db