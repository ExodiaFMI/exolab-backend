import { DataSource } from 'typeorm';
import dotenv from 'dotenv';
import pg from 'pg';
import pgvector from 'pgvector/pg';

dotenv.config();

const client = new pg.Client({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASS,
  port: Number(process.env.DB_PORT),
});

client.connect()
  .then(() => pgvector.registerType(client))
  .then(() => console.log("✅ pgvector type registered successfully"))
  .catch((err) => console.error("❌ pgvector registration failed:", err));

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  ssl: process.env.SSL === 'true' ? { rejectUnauthorized: false } : false,
  synchronize: true,
  logging: false,
  entities: ['src/modules/**/*.entity.ts'],
  migrations: ['src/migrations/*.ts'],
});

export default AppDataSource;
