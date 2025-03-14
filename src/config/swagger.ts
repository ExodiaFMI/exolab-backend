import { getMetadataArgsStorage } from 'routing-controllers';
import { routingControllersToSpec } from 'routing-controllers-openapi';
import swaggerUi from 'swagger-ui-express';
import { Express } from 'express';

export function setupSwagger(app: Express) {
  const storage = getMetadataArgsStorage();
  const spec = routingControllersToSpec(storage, {}, {
    components: {
      schemas: {
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

  app.use('/docs', swaggerUi.serve, swaggerUi.setup(spec));
  console.log('📄 Swagger: http://localhost:3000/docs');
}
