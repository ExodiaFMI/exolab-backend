import { getMetadataArgsStorage } from 'routing-controllers';
import { routingControllersToSpec } from 'routing-controllers-openapi';
import swaggerUi from 'swagger-ui-express';
import { Express } from 'express';

export function setupSwagger(app: Express) {
  const storage = getMetadataArgsStorage();
  const spec = routingControllersToSpec(storage, {}, {
    info: {
      title: 'ExoLab API',
      version: '1.0.0',
      description: 'Documentation for the ExoLab API',
    },
    servers: [{ url: 'http://localhost:3000/api' }],
  });

  app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(spec));
  console.log('📄 Swagger: http://localhost:3000/api/docs');
}
