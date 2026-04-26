import { env } from "./config/env.js";
import { prisma } from "./lib/prisma.js";
import { app } from "./app.js";

const PORT = Number(process.env.PORT) || env.PORT;

const server = app.listen(PORT, "0.0.0.0", () => {
  console.log(`Backend listening on http://0.0.0.0:${PORT}`);
});

async function shutdown() {
  await prisma.$disconnect();
  server.close(() => {
    process.exit(0);
  });
}

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
