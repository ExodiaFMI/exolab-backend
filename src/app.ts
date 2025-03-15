import 'reflect-metadata';
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import { useExpressServer } from 'routing-controllers';
import { setupSwagger } from './config/swagger';
import { UserController } from './modules/user/user.controller';
import { AuthController } from './modules/auth/auth.controller';
import { CourseController } from './modules/course/course.controller';
import { TopicController } from './modules/topic/topic.controller';
import { SubtopicController } from './modules/subtopic/subtopic.controller';
import { SubjectController } from './modules/subject/subject.controller';
import { AgentController } from './modules/agent/agent.controller';

dotenv.config();

const app = express();

app.use(express.json({ limit: '100mb' }));
app.use(express.urlencoded({ limit: '100mb', extended: true }));
app.use(express.raw({ limit: '100mb' }));
app.use(bodyParser.json({ limit: '100mb' }));
app.use(bodyParser.urlencoded({ limit: '100mb', extended: true }));


app.use(cors({
  origin: '*', 
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  maxAge: 86400,
}));

setupSwagger(app);

useExpressServer(app, {
  controllers: [
    UserController,
    AuthController,
    CourseController,
    TopicController,
    SubtopicController,
    SubjectController,
    AgentController
  ],
});

app.get('/', (req, res) => {
  res.send('API is running...');
});

export default app;
