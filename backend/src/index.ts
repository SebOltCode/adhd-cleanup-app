import "reflect-metadata";
import { DataSource } from "typeorm";
import app from "./app";
import * as ormconfig from "../ormconfig";

const PORT = process.env.PORT || 4000;

const dataSource = new DataSource(ormconfig as any);

dataSource
  .initialize()
  .then(() => {
    console.log("DB verbunden");
    app.listen(PORT, () => {
      console.log(`Server läuft auf http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("DB-Verbindung fehlgeschlagen:", err);
  });
