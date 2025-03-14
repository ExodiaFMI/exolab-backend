import 'reflect-metadata';
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { useExpressServer } from 'routing-controllers';
import { setupSwagger } from './config/swagger';
import { UserController } from './modules/user/user.controller';

dotenv.config();

const app = express();

setupSwagger(app);
app.use(cors());
app.use(express.json());

useExpressServer(app, {
  controllers: [UserController],
});

app.get('/', (req, res) => {
  res.send('API is running...');
});

export default app;