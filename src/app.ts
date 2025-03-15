import 'reflect-metadata';
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
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

setupSwagger(app);
app.use(cors());
app.use(express.json());

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