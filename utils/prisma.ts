import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
};

// If this env var is set to "client", Prisma expects a Driver Adapter.
// This project uses the regular Node Query Engine, so force "library".
if (process.env.PRISMA_CLIENT_ENGINE_TYPE === "client") {
  process.env.PRISMA_CLIENT_ENGINE_TYPE = "library";
}

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: ["error"],
});

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
