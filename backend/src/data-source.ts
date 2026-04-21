import "reflect-metadata";
import { DataSource, DataSourceOptions } from "typeorm";
import { Item } from "./models/Item";
import { Room } from "./models/Room";
import { Task } from "./models/Task";
import { TaskGroup } from "./models/TaskGroup";
import { TaskProgress } from "./models/TaskProgress";
import { User } from "./models/User";

const entities = [User, Room, Item, TaskGroup, Task, TaskProgress];

const isProduction = process.env.NODE_ENV === "production";
const useSqlite = process.env.USE_SQLITE === "true";
const synchronize = process.env.TYPEORM_SYNC === "true" || !isProduction;

const postgresOptions: DataSourceOptions = {
  type: "postgres",
  url: process.env.DATABASE_URL,
  host: process.env.DB_HOST ?? "localhost",
  port: Number(process.env.DB_PORT ?? "5432"),
  username: process.env.DB_USERNAME ?? "postgres",
  password: process.env.DB_PASSWORD ?? "postgres",
  database: process.env.DB_NAME ?? "adhd_cleanup",
  synchronize,
  logging: false,
  entities,
};

const sqliteOptions: DataSourceOptions = {
  type: "sqlite",
  database: process.env.SQLITE_PATH ?? "adhd-cleanup.sqlite",
  synchronize: true,
  logging: false,
  entities,
};

const selectedOptions = useSqlite ? sqliteOptions : postgresOptions;

export const AppDataSource = new DataSource(selectedOptions);
