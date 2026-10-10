// scripts/worker.ts
// Worker Daemon Message Broker SimGizi (Consumer Process)
// Jalankan dengan: npm run worker

import { startAllConsumers } from "../src/lib/broker/consumer";

console.log("====================================================");
console.log("   SIM-GIZI MESSAGE BROKER WORKER DAEMON (RABBITMQ) ");
console.log("   Arsitektur Event-Driven Heterogen Multi-Role    ");
console.log("====================================================");

async function main() {
  const success = await startAllConsumers();
  if (!success) {
    console.log(
      "\n[INFO] Pastikan container Docker RabbitMQ sudah menyala dengan menjalankan:\n" +
        "       docker compose up -d\n" +
        "Lalu jalankan worker ini kembali.\n",
    );
    process.exit(1);
  }

  console.log("\n[STATUS] Worker berjalan mendengarkan antrean event...");
  console.log("         Tekan Ctrl+C untuk menghentikan worker.\n");

  const shutdown = async () => {
    console.log("\n[WORKER] Menghentikan worker daemon...");
    process.exit(0);
  };

  process.on("SIGINT", shutdown);
  process.on("SIGTERM", shutdown);
}

main().catch((err) => {
  console.error("[FATAL] Error pada worker:", err);
  process.exit(1);
});
