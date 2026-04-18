import { env } from "./config/env.js";
import { prisma } from "./lib/prisma.js";
import { app } from "./app.js";

const server = const PORT = Number(process.env.PORT || 4000);

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on ${PORT}`);
});=> {
  console.log(`Backend listening on http://localhost:${env.PORT}`);
});

async function shutdown() {
  await prisma.$disconnect();
  server.close(() => {
    process.exit(0);
  });
}

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
