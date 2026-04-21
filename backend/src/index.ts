import app from "./app";
import { AppDataSource } from "./data-source";

const PORT = Number(process.env.PORT ?? 4000);

async function bootstrap() {
  try {
    await AppDataSource.initialize();
    console.log("📦 Datenbank verbunden");

    app.listen(PORT, () => {
      console.log(`🚀 Server läuft auf http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("DB-Verbindung fehlgeschlagen", error);
    process.exit(1);
  }
}

void bootstrap();
