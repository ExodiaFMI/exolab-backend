import { getMetadataArgsStorage } from 'routing-controllers';
import { routingControllersToSpec } from 'routing-controllers-openapi';
import swaggerUi from 'swagger-ui-express';
import { Express } from 'express';
import fs from 'fs';
import { Language } from '../enums/language.enum';

export function setupSwagger(app: Express) {
  const storage = getMetadataArgsStorage();
  const spec = routingControllersToSpec(storage, {}, {
    components: {
      schemas: {
        LanguagesEnum: {
          type: 'string',
          enum: Object.values(Language),
        },
        CreateUserDto: {
          type: 'object',
          properties: {
            name: { type: 'string', minLength: 3 },
            email: { type: 'string', format: 'email' },
            password: { type: 'string', minLength: 6 }
          },
          required: ['name', 'email', 'password']
        },
        UserResponseDto: {
          type: 'object',
          properties: {
            id: { type: 'number' },
            name: { type: 'string' },
            email: { type: 'string' }
          }
        },
        CreateCourseDto: {
          type: 'object',
          properties: {
            name: { type: 'string', minLength: 3 },
            description: { type: 'string', minLength: 10 },
            testInfo: { type: 'string', minLength: 5 },
            subjectId: { type: 'number' },
            language: {  $ref: '#/components/schemas/LanguagesEnum' },
            ownerId: { type: 'number' }
          },
          required: ['name', 'description', 'testInfo', 'subjectId', 'language', 'ownerId']
        },
        CourseResponseDto: {
          type: 'object',
          properties: {
            id: { type: 'number' },
            name: { type: 'string' },
            description: { type: 'string' },
            testInfo: { type: 'string' },
            language: { type: 'string' },
            subject: {
              type: 'object',
              properties: {
                id: { type: 'number' },
                name: { type: 'string' }
              }
            },
            owner: {
              type: 'object',
              properties: {
                id: { type: 'number' },
                name: { type: 'string' },
                email: { type: 'string' }
              }
            }
          }
        },
        LoginDto: {
          type: 'object',
          properties: {
            email: { type: 'string', format: 'email' },
            password: { type: 'string', minLength: 6 }
          },
          required: ['email', 'password']
        },
        SubjectResponseDto: {
          type: 'object',
          properties: {
            id: { type: 'number' },
            name: { type: 'string' }
          }
        },
        SubtopicResponseDto: {
          type: 'object',
          properties: {
            id: { type: 'number' },
            name: { type: 'string' },
            text: { type: 'string' },
            topic: {
              type: 'object',
              properties: {
                id: { type: 'number' },
                name: { type: 'string' }
              }
            }
          }
        },
        TopicResponseDto: {
          type: 'object',
          properties: {
            id: { type: 'number' },
            name: { type: 'string' },
            course: {
              type: 'object',
              properties: {
                id: { type: 'number' },
                name: { type: 'string' }
              }
            }
          }
        },
        Resource: {
          type: 'object',
          properties: {
            id: { type: 'number' },
            source_url: { type: 'string', format: 'uri' },
            type: { 
              type: 'string', 
              enum: ['VIDEO', 'ARTICLE', 'BOOK', 'DOCUMENT', 'OTHER']
            },
            subtopic: {
              type: 'object',
              properties: {
                id: { type: 'number' },
                name: { type: 'string' }
              }
            }
          }
        }
        
        
      }
    },
    info: {
      title: 'ExoLab API',
      version: '1.0.0',
      description: 'Documentation for the ExoLab API',
    },
    servers: [{ url: 'http://localhost:3000' }],
  });

  fs.mkdirSync('./openapi', { recursive: true });
  fs.writeFileSync('./openapi/swagger.json', JSON.stringify(spec, null, 2), 'utf-8');;

  app.use('/docs', swaggerUi.serve, swaggerUi.setup(spec));
  console.log('📄 Swagger: http://localhost:3000/docs');
}
